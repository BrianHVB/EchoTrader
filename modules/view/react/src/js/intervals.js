import Logger from 'config/logger';
const log = new Logger('marketTable');


class ThirtySecond {
	base = 1;
	minute = this.base * 2;
	fiveMinute = this.minute * 5 ;
	tenMinute = this.minute * 10 ;
	fifteenMinute = this.minute * 15 ;
	halfHour = this.minute * 30 ;
	hour = this.minute * 60 ;
	twoHour =  this.hour * 2 ;
	fourHour =  this.hour * 4 ;
	sixHour =  this.hour * 6 ;
	eightHour =  this.hour * 8 ;
	twelveHour =  this.hour * 12 ;
	day =  this.hour * 24 ;
	week =  this.day * 7 ;
	month =  this.day * 30 ;
	quarter =  this.day * 91.25 ;
	year = this.day * 365;
}

const ts = new ThirtySecond();

export default ts;

