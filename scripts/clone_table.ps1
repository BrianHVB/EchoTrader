$tableNames = "gdax_eth_usd", "gdax_eth_btc", "gdax_eth_btc", "gdax_ltc_usd"
ForEach($table in $tableNames) {
 (Get-Content clone_table_gdax_basic.sql).replace('gdax_basic',$table) | Set-Content temp.sql
  Get-Content temp.sql | psql postgresql://postgres:*,s4everPost@localhost/et_market_data_test
  
}