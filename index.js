/* statement 함수 쪼개기
 * - 값 변경 없는 초기 변수를 추출한 함수의 매개변수로 전달하고,
 * - 해당 값을 변경해서 받는 형식으로 변경
 * - 임시 변수는 없애고 질의 함수 형태로 넣는다.
 * - 함수의 반환 값에는 항상 result를 사용한다.
 * - 함수 선언 바꾸기 : 핵심 느낌을 살릴 수 있는 식별자로 변경
 */

/* -------------------------------------------------------------- */

/* --------------------------T E S T------------------------------------ */

const invoices = require('./invoices.json');
const plays = require('./plays.json');
const { statement } = require('./statement.js');

console.log(
	`✅ Test Result : ${
		statement(invoices[0], plays) ===
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
