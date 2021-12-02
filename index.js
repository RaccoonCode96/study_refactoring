/* statement 함수 쪼개기
 * - 값 변경 없는 초기 변수를 추출한 함수의 매개변수로 전달하고,
 * - 해당 값을 변경해서 받는 형식으로 변경
 * - 임시 변수는 없애고 질의 함수 형태로 넣는다.
 */

function amoutFor(aPerformance) {
	/*
	 * - 함수의 반환 값에는 항상 result를 사용한다.
	 */

	// 합을 구한다.
	let result = 0;
	switch (playFor(aPerformance).type) {
		case 'tragedy': // 비극
			result = 40000;
			if (aPerformance.audience > 30) {
				result += 1000 * (aPerformance.audience - 30);
			}
			break;
		case 'comedy': // 희극
			result = 30000;
			if (aPerformance.audience > 20) {
				result += 10000 + 500 * (aPerformance.audience - 20);
			}
			result += 300 * aPerformance.audience;
			break;
		default:
			throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
	}
	return result;
}

function playFor(aPerformance) {
	return plays[aPerformance.playID];
}

function volumeCreditsFor(aPerformance) {
	let result = 0;
	result += Math.max(aPerformance.audience - 30, 0);
	if ('comedy' === playFor(aPerformance).type)
		result += Math.floor(aPerformance.audience / 5);
	return result;
}

// 함수 선언 바꾸기 : 핵심 느낌을 살릴 수 있는 식별자로 변경
function usd(aNumber) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	}).format(aNumber / 100);
}

function totalVolumeCredits(invoice) {
	// 반복문 쪼개기 & 문장 슬라이드 하기
	let volumeCredits = 0;
	for (let perf of invoice.performances) {
		volumeCredits += volumeCreditsFor(perf);
	}
	return volumeCredits;
}

function statement(invoice) {
	let totalAmount = 0;
	let result = `청구 내역 (고객명: ${invoice.customer})\n`;

	for (let perf of invoice.performances) {
		// 포인트를 적립한다.
		// 희극 관객 5명마다 추가 포인트를 제공한다.

		// 청구 내역을 출력한다.
		result += ` ${playFor(perf).name}: ${usd(amoutFor(perf))} (${
			perf.audience
		}석)\n`;
		totalAmount += amoutFor(perf);
	}

	result += `총액: ${usd(totalAmount)}\n`;
	result += `적립 포인트: ${totalVolumeCredits(invoice)}점\n`;
	return result;
}

const invoices = require('./invoices.json');
const plays = require('./plays.json');

console.log(
	`✅ Test Result : ${
		statement(invoices[0]) ===
		'청구 내역 (고객명: BigCo)\n' +
			' Hamlet: $650.00 (55석)\n' +
			' As You Like It: $580.00 (35석)\n' +
			' Othello: $500.00 (40석)\n' +
			'총액: $1,730.00\n' +
			'적립 포인트: 47점\n'
			? '⭕ Good👍'
			: '❌ Nope👎'
	}
	`
);

/* 
청구 내역 (고객명: BigCo)
 Hamlet: $650.00 (55석)
 As You Like It: $580.00 (35석)
 Othello: $500.00 (40석)
총액: $1,730.00
적립 포인트: 47점
*/
