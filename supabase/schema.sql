-- Supabase Schema for Raja Mantri Chor Sipahi Multiplayer

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if re-running
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'WAITING',
  phase TEXT DEFAULT 'LOBBY',
  current_round INT DEFAULT 1,
  total_rounds INT DEFAULT 5,
  king_id UUID,
  minister_id UUID,
  thief_id UUID,
  police_id UUID,
  guessed_thief_id UUID,
  guess_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score INT DEFAULT 0,
  is_host BOOLEAN DEFAULT FALSE,
  secret UUID NOT NULL,
  is_ready BOOLEAN DEFAULT FALSE,
  is_connected BOOLEAN DEFAULT TRUE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE roles (
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  round_number INT,
  role TEXT,
  PRIMARY KEY (room_id, player_id, round_number)
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rooms are readable by everyone" ON rooms FOR SELECT USING (true);
CREATE POLICY "Players are readable by everyone" ON players FOR SELECT USING (true);
CREATE POLICY "Roles are hidden" ON roles FOR SELECT USING (false);

BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE players;

CREATE OR REPLACE FUNCTION create_room(p_name TEXT, p_secret UUID, p_rounds INT) RETURNS json AS $$
DECLARE v_room_id UUID; v_room_code TEXT; v_player_id UUID;
BEGIN
  v_room_code := upper(substring(md5(random()::text) from 1 for 6));
  INSERT INTO rooms (code, total_rounds) VALUES (v_room_code, p_rounds) RETURNING id INTO v_room_id;
  INSERT INTO players (room_id, name, is_host, secret) VALUES (v_room_id, p_name, TRUE, p_secret) RETURNING id INTO v_player_id;
  RETURN json_build_object('room_id', v_room_id, 'room_code', v_room_code, 'player_id', v_player_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION join_room(p_code TEXT, p_name TEXT, p_secret UUID) RETURNS json AS $$
DECLARE v_room_id UUID; v_player_id UUID; v_count INT;
BEGIN
  SELECT id INTO v_room_id FROM rooms WHERE code = p_code AND status = 'WAITING';
  IF NOT FOUND THEN RAISE EXCEPTION 'Room not found or already started'; END IF;
  SELECT count(*) INTO v_count FROM players WHERE room_id = v_room_id;
  IF v_count >= 4 THEN RAISE EXCEPTION 'Room is full'; END IF;
  INSERT INTO players (room_id, name, is_host, secret) VALUES (v_room_id, p_name, FALSE, p_secret) RETURNING id INTO v_player_id;
  RETURN json_build_object('room_id', v_room_id, 'player_id', v_player_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION start_round(p_room_id UUID, p_secret UUID) RETURNS void AS $$
DECLARE v_host_id UUID; v_roles TEXT[] := ARRAY['KING', 'MINISTER', 'POLICE', 'THIEF']; v_players UUID[]; v_round INT; i INT;
BEGIN
  SELECT id INTO v_host_id FROM players WHERE room_id = p_room_id AND secret = p_secret AND is_host = TRUE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  SELECT current_round INTO v_round FROM rooms WHERE id = p_room_id;
  SELECT array_agg(id ORDER BY random()) INTO v_players FROM players WHERE room_id = p_room_id;
  IF array_length(v_players, 1) != 4 THEN RAISE EXCEPTION 'Need exactly 4 players'; END IF;
  FOR i IN 1..4 LOOP
    INSERT INTO roles (room_id, player_id, round_number, role) VALUES (p_room_id, v_players[i], v_round, v_roles[i])
    ON CONFLICT (room_id, player_id, round_number) DO UPDATE SET role = EXCLUDED.role;
  END LOOP;
  UPDATE rooms SET status = 'PLAYING', phase = 'PLAYER_ROLE_REVEAL', king_id = NULL, minister_id = NULL, thief_id = NULL, police_id = NULL, guessed_thief_id = NULL, guess_correct = NULL WHERE id = p_room_id;
  UPDATE players SET is_ready = FALSE WHERE room_id = p_room_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_my_role(p_room_id UUID, p_secret UUID) RETURNS TEXT AS $$
DECLARE v_role TEXT; v_round INT;
BEGIN
  SELECT current_round INTO v_round FROM rooms WHERE id = p_room_id;
  SELECT r.role INTO v_role FROM roles r JOIN players p ON r.player_id = p.id WHERE p.room_id = p_room_id AND p.secret = p_secret AND r.round_number = v_round;
  RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION set_ready(p_room_id UUID, p_secret UUID) RETURNS void AS $$
DECLARE v_ready_count INT;
BEGIN
  UPDATE players SET is_ready = TRUE WHERE room_id = p_room_id AND secret = p_secret;
  SELECT count(*) INTO v_ready_count FROM players WHERE room_id = p_room_id AND is_ready = TRUE;
  IF v_ready_count = 4 THEN
    UPDATE rooms SET phase = 'KING_CALL' WHERE id = p_room_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_phase(p_room_id UUID, p_secret UUID, p_phase TEXT) RETURNS void AS $$
DECLARE v_round INT; v_role TEXT; v_player_id UUID;
BEGIN
  SELECT id INTO v_player_id FROM players WHERE room_id = p_room_id AND secret = p_secret;
  IF NOT FOUND THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  SELECT current_round INTO v_round FROM rooms WHERE id = p_room_id;
  SELECT role INTO v_role FROM roles WHERE room_id = p_room_id AND player_id = v_player_id AND round_number = v_round;
  
  IF p_phase = 'MINISTER_REVEAL' AND v_role = 'KING' THEN
    UPDATE rooms SET phase = p_phase, king_id = v_player_id WHERE id = p_room_id;
  ELSIF p_phase = 'MINISTER_GUESS' AND v_role = 'MINISTER' THEN
    UPDATE rooms SET phase = p_phase, minister_id = v_player_id WHERE id = p_room_id;
  ELSE
    UPDATE rooms SET phase = p_phase WHERE id = p_room_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION submit_guess(p_room_id UUID, p_secret UUID, p_target_id UUID) RETURNS void AS $$
DECLARE v_minister_id UUID; v_actual_thief_id UUID; v_correct BOOLEAN; v_round INT; v_king_id UUID; v_police_id UUID; v_total_rounds INT;
BEGIN
  SELECT current_round, total_rounds INTO v_round, v_total_rounds FROM rooms WHERE id = p_room_id;
  SELECT p.id INTO v_minister_id FROM players p JOIN roles r ON p.id = r.player_id WHERE p.room_id = p_room_id AND p.secret = p_secret AND r.role = 'MINISTER' AND r.round_number = v_round;
  IF NOT FOUND THEN RAISE EXCEPTION 'Only minister can guess'; END IF;
  SELECT player_id INTO v_actual_thief_id FROM roles WHERE room_id = p_room_id AND round_number = v_round AND role = 'THIEF';
  SELECT player_id INTO v_king_id FROM roles WHERE room_id = p_room_id AND round_number = v_round AND role = 'KING';
  SELECT player_id INTO v_police_id FROM roles WHERE room_id = p_room_id AND round_number = v_round AND role = 'POLICE';
  v_correct := (p_target_id = v_actual_thief_id);
  
  UPDATE players SET score = score + 1000 WHERE id = v_king_id;
  UPDATE players SET score = score + 300 WHERE id = v_police_id;
  IF v_correct THEN UPDATE players SET score = score + 500 WHERE id = v_minister_id;
  ELSE UPDATE players SET score = score + 500 WHERE id = v_actual_thief_id; END IF;
  
  UPDATE rooms SET phase = 'ROUND_RESULT', guessed_thief_id = p_target_id, guess_correct = v_correct, thief_id = v_actual_thief_id, king_id = v_king_id, minister_id = v_minister_id, police_id = v_police_id WHERE id = p_room_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION next_round(p_room_id UUID, p_secret UUID) RETURNS void AS $$
DECLARE v_host_id UUID; v_round INT; v_total INT;
BEGIN
  SELECT id INTO v_host_id FROM players WHERE room_id = p_room_id AND secret = p_secret AND is_host = TRUE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Only host can advance round'; END IF;
  SELECT current_round, total_rounds INTO v_round, v_total FROM rooms WHERE id = p_room_id;
  IF v_round >= v_total THEN UPDATE rooms SET phase = 'GAME_OVER', status = 'FINISHED' WHERE id = p_room_id;
  ELSE UPDATE rooms SET current_round = current_round + 1 WHERE id = p_room_id; PERFORM start_round(p_room_id, p_secret); END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION leave_room(p_room_id UUID, p_secret UUID) RETURNS void AS $$
DECLARE v_player_id UUID; v_is_host BOOLEAN; v_new_host_id UUID;
BEGIN
  SELECT id, is_host INTO v_player_id, v_is_host FROM players WHERE room_id = p_room_id AND secret = p_secret;
  IF NOT FOUND THEN RETURN; END IF;
  DELETE FROM players WHERE id = v_player_id;
  IF v_is_host THEN
    SELECT id INTO v_new_host_id FROM players WHERE room_id = p_room_id ORDER BY joined_at ASC LIMIT 1;
    IF v_new_host_id IS NOT NULL THEN UPDATE players SET is_host = TRUE WHERE id = v_new_host_id; END IF;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM players WHERE room_id = p_room_id) THEN DELETE FROM rooms WHERE id = p_room_id; END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
