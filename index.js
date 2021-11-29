function statement(invoice, plays) {
	let totalAmount = 0;
	let volumeCredits = 0;
	let result = `청구 내역 (고객명: ${invoice.customer})\n`;
	const format = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	}).format;

	for (let perf of invoice.performances) {
		const play = plays[perf.playID];
		let thisAmout = 0;

		switch (play.type) {
			case 'tragedy': // 비극
				thisAmout = 40000;
				if (perf.audience > 30) {
					thisAmout += 1000 * (perf.audience - 30);
				}
				break;
			case 'comedy': // 희극
				thisAmout = 30000;
				if (perf.audience > 20) {
					thisAmout += 100000 + 500;
				}
				break;
			default:
				throw new Error(`알 수 없는 장르: ${play.type}`);
		}

		// 포인트를 적립한다.
		volumeCredits += Math.max(perf.audience - 30, 0);
		// 희극 관객 5명마다 추가 포인트를 제공한다.
		if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);

		// 청구 내역을 출력한다.
		result += ` ${play.name}: ${format(thisAmout / 100)} (${
			perf.audience
		}석)\n`;
		totalAmount += thisAmout;
	}
	result += `총액: ${format(totalAmount / 100)}\n`;
	result += `적립 포인트: ${volumeCredits}점\n`;
	return result;
}

const invoices = require('./invoices.json');
const plays = require('./plays.json');

console.log(statement(invoices[0], plays));

/* 
Hamlet: $650.00 (55석)
As You Like It: $1,305.00 (35석)
Othello: $500.00 (40석)
총액: $2,455.00
적립 포인트: 47점
*/
