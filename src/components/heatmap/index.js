import Transactions from "./transactions.json";
import './style.css';

function sumUpTransactions(transactionArray) {
	const sumMap = {};
	const start = new Date(Date.UTC(2019, 0, 1));
	const end = new Date(Date.UTC(2020, 0, 1));

	while (start < end) {
		const ymd = start.toISOString().split('T')[0];
		sumMap[ymd] = 0;
		start.setDate(start.getDate() + 1);
	}

	for (const record of transactionArray) {
		const balance = sumMap[record.date];
		const newBalance = record.transactionType === 'credit' ? balance + record.amount : balance - record.amount;
		sumMap[record.date] = newBalance;
	}

	for (const date in sumMap) sumMap[date] = Number(sumMap[date].toFixed(2));

	return sumMap;
}

function splitSumsToWeeks(sumsPerDay) {
	const sumsByWeek = new Array(7).fill('').map(() => []);
	const firstDayOfYear = new Date(Object.keys(sumsPerDay)[0]).getDay();

	const maxAbs = Math.max(...Object.values(sumsPerDay).map(Math.abs));
	const colorScheme = {
		'-3': '#8B0000',
		'-2': '#800000',
		'-1': '#FF0000',
		'0': '',
		'1': '#228B22',
		'2': '#00FF00',
		'3': '#006400',
	};

	for (let i = 0; i < firstDayOfYear; ++i) sumsByWeek[i] = [{ empty: true }];

	for (const date in sumsPerDay) {
		const weekNumber = new Date(date).getDay();
		const value = sumsPerDay[date];
		const colorNum = value > 0 ? Math.ceil((value / maxAbs) * 3) : Math.floor((value / maxAbs) * 3);

		sumsByWeek[weekNumber].push({
			empty: false,
			value,
			color: colorScheme[colorNum],
		});
	}

	return {
		'Sun': sumsByWeek[0],
		'Mon': sumsByWeek[1],
		'Tue': sumsByWeek[2],
		'Wed': sumsByWeek[3],
		'Thu': sumsByWeek[4],
		'Fri': sumsByWeek[5],
		'Sat': sumsByWeek[6],
	};
}

function parseTransactions() {
  	const sumsPerDay = sumUpTransactions(Transactions);
	return splitSumsToWeeks(sumsPerDay);
}

function getSpaceInPx(s) {
    return s * 20 + s * 2; 
}

function week(year, monthNumber) {
    const firstOfMonth = new Date(year, monthNumber, 1);
    const lastOfMonth = new Date(year, monthNumber + 1, 0);
    const used = firstOfMonth.getDay() + lastOfMonth.getDate();
    return Math.floor( used / 7);
}


const Days = ({day, series}) => (
    <div className="row days">
        <div className="day-name">
            <p>{day}</p>
        </div>
        <div className="row boxes">
            {series.map((s,i)=>{
                return (
                    <span key={i} title={s.value} className={s.empty ? 'empty' : 'box'} style={{backgroundColor: s.color}} />
                )
            })}
        </div>
    </div>
)

const Month = () => {
    const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return (
        <div className="row days">
            <div className="day-name"/>
            <div className="row">
                {mon.map((value,index)=>{
                    return (
                        <p key={index} style={{width: `${getSpaceInPx(week(2019,index))}px`}}>{value}</p>
                    )
                })}
            </div>
        </div>
    )
}

function HeatMap() {
  	const data = parseTransactions();
    return (
      <div className="container">
        {Object.entries(data).map(([day, series]) => {
          return (
            <Days key={day} day={day} series={series} />
          );
        })}
        <Month />
      </div>
    );
}
  
export default HeatMap;