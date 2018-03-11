--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE et_market_data;
--
-- Name: et_market_data; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE et_market_data WITH TEMPLATE = template0;


\connect et_market_data

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: clear_all_data_from_gdax_tables(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION clear_all_data_from_gdax_tables() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  tables CURSOR FOR
    SELECT table_name
    FROM information_schema.tables
    WHERE table_name LIKE 'gdax_%'
    ORDER BY table_name;
BEGIN
  FOR table_record IN tables LOOP
    EXECUTE 'DELETE FROM ' || table_record.table_name || '*';
  END LOOP;
  
END;
$$;


--
-- Name: clear_gdax_data(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION clear_gdax_data() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  tables CURSOR FOR
    SELECT table_name
    FROM information_schema.tables
    WHERE table_name LIKE 'gdax_%'
    ORDER BY table_name;
BEGIN
  FOR table_record IN tables LOOP
    EXECUTE 'DELETE FROM ' || table_record.table_name || ' WHERE exchange = ''GDAX'' ';
  END LOOP;
END;
$$;


--
-- Name: clear_test_data(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION clear_test_data() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  tables CURSOR FOR
    SELECT table_name
    FROM information_schema.tables
    WHERE table_name LIKE 'gdax_%'
    ORDER BY table_name;
BEGIN
  FOR table_record IN tables LOOP
    EXECUTE 'DELETE FROM ' || table_record.table_name || ' WHERE market = ''TEST'' ';
  END LOOP;
END;
$$;


--
-- Name: create_market_table(character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION create_market_table(table_name character varying) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
EXECUTE format('
  CREATE TABLE IF NOT EXISTS %1$I (
    id BIGSERIAL PRIMARY KEY,
    market VARCHAR(25) REFERENCES markets
  ) INHERITS (market_template);
  GRANT SELECT, INSERT ON %1$I TO et_data_interface;
  GRANT USAGE on %1$I_id_seq TO et_data_interface;

', table_name);

END
$_$;


--
-- Name: reset_gdax_sequences(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION reset_gdax_sequences() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  sequences CURSOR FOR
    SELECT sequence_name
    FROM information_schema.sequences
    WHERE sequence_name LIKE 'gdax_%'
    ORDER BY sequence_name;
BEGIN
  FOR sequence_record IN sequences LOOP
    EXECUTE 'ALTER SEQUENCE ' || sequence_record.sequence_name || ' RESTART WITH 1;';
  END LOOP;
END;
$$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: market_template; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE market_template (
    id bigint NOT NULL,
    "time" timestamp with time zone DEFAULT now(),
    market character varying(25),
    open numeric(28,10),
    high numeric(28,10),
    low numeric(28,10),
    close numeric(28,10),
    volume_in numeric(28,10),
    volume_out numeric(28,10),
    total_trades integer,
    time_open timestamp with time zone,
    time_close timestamp with time zone,
    last_trade_id bigint
);


--
-- Name: gdax_bch_usd; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE gdax_bch_usd (
    id bigint,
    market character varying(25)
)
INHERITS (market_template);


--
-- Name: gdax_bch_usd_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE gdax_bch_usd_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gdax_bch_usd_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE gdax_bch_usd_id_seq OWNED BY gdax_bch_usd.id;


--
-- Name: gdax_btc_usd; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE gdax_btc_usd (
    id bigint,
    market character varying(25)
)
INHERITS (market_template);


--
-- Name: gdax_btc_usd_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE gdax_btc_usd_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gdax_btc_usd_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE gdax_btc_usd_id_seq OWNED BY gdax_btc_usd.id;


--
-- Name: gdax_eth_btc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE gdax_eth_btc (
    id bigint,
    market character varying(25)
)
INHERITS (market_template);


--
-- Name: gdax_eth_btc_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE gdax_eth_btc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gdax_eth_btc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE gdax_eth_btc_id_seq OWNED BY gdax_eth_btc.id;


--
-- Name: gdax_eth_usd; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE gdax_eth_usd (
    id bigint,
    market character varying(25)
)
INHERITS (market_template);


--
-- Name: gdax_eth_usd_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE gdax_eth_usd_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gdax_eth_usd_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE gdax_eth_usd_id_seq OWNED BY gdax_eth_usd.id;


--
-- Name: gdax_ltc_usd; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE gdax_ltc_usd (
    id bigint,
    market character varying(25)
)
INHERITS (market_template);


--
-- Name: gdax_ltc_usd_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE gdax_ltc_usd_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gdax_ltc_usd_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE gdax_ltc_usd_id_seq OWNED BY gdax_ltc_usd.id;


--
-- Name: gdax_test; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE gdax_test (
    id bigint,
    market character varying(25)
)
INHERITS (market_template);


--
-- Name: gdax_test_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE gdax_test_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gdax_test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE gdax_test_id_seq OWNED BY gdax_test.id;


--
-- Name: market_template_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE market_template_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: market_template_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE market_template_id_seq OWNED BY market_template.id;


--
-- Name: markets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE markets (
    name text,
    symbol character varying(25) NOT NULL
);


--
-- Name: gdax_bch_usd id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_bch_usd ALTER COLUMN id SET DEFAULT nextval('gdax_bch_usd_id_seq'::regclass);


--
-- Name: gdax_bch_usd time; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_bch_usd ALTER COLUMN "time" SET DEFAULT now();


--
-- Name: gdax_btc_usd id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_btc_usd ALTER COLUMN id SET DEFAULT nextval('gdax_btc_usd_id_seq'::regclass);


--
-- Name: gdax_btc_usd time; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_btc_usd ALTER COLUMN "time" SET DEFAULT now();


--
-- Name: gdax_eth_btc id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_eth_btc ALTER COLUMN id SET DEFAULT nextval('gdax_eth_btc_id_seq'::regclass);


--
-- Name: gdax_eth_btc time; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_eth_btc ALTER COLUMN "time" SET DEFAULT now();


--
-- Name: gdax_eth_usd id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_eth_usd ALTER COLUMN id SET DEFAULT nextval('gdax_eth_usd_id_seq'::regclass);


--
-- Name: gdax_eth_usd time; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_eth_usd ALTER COLUMN "time" SET DEFAULT now();


--
-- Name: gdax_ltc_usd id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_ltc_usd ALTER COLUMN id SET DEFAULT nextval('gdax_ltc_usd_id_seq'::regclass);


--
-- Name: gdax_ltc_usd time; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_ltc_usd ALTER COLUMN "time" SET DEFAULT now();


--
-- Name: gdax_test id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_test ALTER COLUMN id SET DEFAULT nextval('gdax_test_id_seq'::regclass);


--
-- Name: gdax_test time; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_test ALTER COLUMN "time" SET DEFAULT now();


--
-- Name: market_template id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY market_template ALTER COLUMN id SET DEFAULT nextval('market_template_id_seq'::regclass);


--
-- Data for Name: gdax_bch_usd; Type: TABLE DATA; Schema: public; Owner: -
--

COPY gdax_bch_usd (id, "time", market, open, high, low, close, volume_in, volume_out, total_trades, time_open, time_close, last_trade_id) FROM stdin;
\.


--
-- Data for Name: gdax_btc_usd; Type: TABLE DATA; Schema: public; Owner: -
--

COPY gdax_btc_usd (id, "time", market, open, high, low, close, volume_in, volume_out, total_trades, time_open, time_close, last_trade_id) FROM stdin;
\.


--
-- Data for Name: gdax_eth_btc; Type: TABLE DATA; Schema: public; Owner: -
--

COPY gdax_eth_btc (id, "time", market, open, high, low, close, volume_in, volume_out, total_trades, time_open, time_close, last_trade_id) FROM stdin;
\.


--
-- Data for Name: gdax_eth_usd; Type: TABLE DATA; Schema: public; Owner: -
--

COPY gdax_eth_usd (id, "time", market, open, high, low, close, volume_in, volume_out, total_trades, time_open, time_close, last_trade_id) FROM stdin;
\.


--
-- Data for Name: gdax_ltc_usd; Type: TABLE DATA; Schema: public; Owner: -
--

COPY gdax_ltc_usd (id, "time", market, open, high, low, close, volume_in, volume_out, total_trades, time_open, time_close, last_trade_id) FROM stdin;
\.


--
-- Data for Name: gdax_test; Type: TABLE DATA; Schema: public; Owner: -
--

COPY gdax_test (id, "time", market, open, high, low, close, volume_in, volume_out, total_trades, time_open, time_close, last_trade_id) FROM stdin;
\.


--
-- Data for Name: market_template; Type: TABLE DATA; Schema: public; Owner: -
--

COPY market_template (id, "time", market, open, high, low, close, volume_in, volume_out, total_trades, time_open, time_close, last_trade_id) FROM stdin;
\.


--
-- Data for Name: markets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY markets (name, symbol) FROM stdin;
Test	TEST
GDAX-BCH-USD	GDAX-BCH-USD
GDAX-BTC-USD	GDAX-BTC-USD
GDAX-ETH-BTC	GDAX-ETH-BTC
GDAX-ETH-USD	GDAX-ETH-USD
GDAX-LTC-USD	GDAX-LTC-USD
\.


--
-- Name: gdax_bch_usd_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('gdax_bch_usd_id_seq', 1, false);


--
-- Name: gdax_btc_usd_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('gdax_btc_usd_id_seq', 1, false);


--
-- Name: gdax_eth_btc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('gdax_eth_btc_id_seq', 1, false);


--
-- Name: gdax_eth_usd_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('gdax_eth_usd_id_seq', 1, false);


--
-- Name: gdax_ltc_usd_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('gdax_ltc_usd_id_seq', 1, false);


--
-- Name: gdax_test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('gdax_test_id_seq', 1, false);


--
-- Name: market_template_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('market_template_id_seq', 1, false);


--
-- Name: markets exchanges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY markets
    ADD CONSTRAINT exchanges_pkey PRIMARY KEY (symbol);


--
-- Name: gdax_bch_usd gdax_bch_usd_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_bch_usd
    ADD CONSTRAINT gdax_bch_usd_pkey PRIMARY KEY (id);


--
-- Name: gdax_btc_usd gdax_btc_usd_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_btc_usd
    ADD CONSTRAINT gdax_btc_usd_pkey PRIMARY KEY (id);


--
-- Name: gdax_eth_btc gdax_eth_btc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_eth_btc
    ADD CONSTRAINT gdax_eth_btc_pkey PRIMARY KEY (id);


--
-- Name: gdax_eth_usd gdax_eth_usd_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_eth_usd
    ADD CONSTRAINT gdax_eth_usd_pkey PRIMARY KEY (id);


--
-- Name: gdax_ltc_usd gdax_ltc_usd_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_ltc_usd
    ADD CONSTRAINT gdax_ltc_usd_pkey PRIMARY KEY (id);


--
-- Name: gdax_test gdax_test_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_test
    ADD CONSTRAINT gdax_test_pkey PRIMARY KEY (id);


--
-- Name: market_template market_template_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY market_template
    ADD CONSTRAINT market_template_pkey PRIMARY KEY (id);


--
-- Name: gdax_bch_usd gdax_bch_usd_market_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_bch_usd
    ADD CONSTRAINT gdax_bch_usd_market_fkey FOREIGN KEY (market) REFERENCES markets(symbol);


--
-- Name: gdax_btc_usd gdax_btc_usd_market_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_btc_usd
    ADD CONSTRAINT gdax_btc_usd_market_fkey FOREIGN KEY (market) REFERENCES markets(symbol);


--
-- Name: gdax_eth_btc gdax_eth_btc_market_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_eth_btc
    ADD CONSTRAINT gdax_eth_btc_market_fkey FOREIGN KEY (market) REFERENCES markets(symbol);


--
-- Name: gdax_eth_usd gdax_eth_usd_market_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_eth_usd
    ADD CONSTRAINT gdax_eth_usd_market_fkey FOREIGN KEY (market) REFERENCES markets(symbol);


--
-- Name: gdax_ltc_usd gdax_ltc_usd_market_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_ltc_usd
    ADD CONSTRAINT gdax_ltc_usd_market_fkey FOREIGN KEY (market) REFERENCES markets(symbol);


--
-- Name: gdax_test gdax_test_market_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY gdax_test
    ADD CONSTRAINT gdax_test_market_fkey FOREIGN KEY (market) REFERENCES markets(symbol);


--
-- Name: market_template market_template_market_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY market_template
    ADD CONSTRAINT market_template_market_fkey FOREIGN KEY (market) REFERENCES markets(symbol);


--
-- Name: public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: gdax_bch_usd; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT ON TABLE gdax_bch_usd TO et_data_interface;


--
-- Name: gdax_bch_usd_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE gdax_bch_usd_id_seq TO et_data_interface;


--
-- Name: gdax_btc_usd; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT ON TABLE gdax_btc_usd TO et_data_interface;


--
-- Name: gdax_btc_usd_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE gdax_btc_usd_id_seq TO et_data_interface;


--
-- Name: gdax_eth_btc; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT ON TABLE gdax_eth_btc TO et_data_interface;


--
-- Name: gdax_eth_btc_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE gdax_eth_btc_id_seq TO et_data_interface;


--
-- Name: gdax_eth_usd; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT ON TABLE gdax_eth_usd TO et_data_interface;


--
-- Name: gdax_eth_usd_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE gdax_eth_usd_id_seq TO et_data_interface;


--
-- Name: gdax_ltc_usd; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT ON TABLE gdax_ltc_usd TO et_data_interface;


--
-- Name: gdax_ltc_usd_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE gdax_ltc_usd_id_seq TO et_data_interface;


--
-- Name: gdax_test; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,UPDATE ON TABLE gdax_test TO et_data_interface;


--
-- Name: gdax_test_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT USAGE ON SEQUENCE gdax_test_id_seq TO et_data_interface;


--
-- PostgreSQL database dump complete
--

