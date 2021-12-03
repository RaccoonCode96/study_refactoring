// 조건부 로직을 다형성으로 바꾸기

// 생성자를 팩터리 함수로 바꾸기(생성자가 서브클래스의 인스턴스를 반환할 수 없기 때문

function createPerformanceCalculator(aPerformance, aPlay) {
	switch (aPlay.type) {
		case 'tragedy':
			return new TragedyCalculator(aPerformance, aPlay);
		case 'comedy':
			return new ComedyCalculator(aPerformance, aPlay);
		default:
			throw new Error(`알 수 없는 경로: ${aPlay.type}`);
	}
}
class PerformanceCalculator {
	constructor(aPerformance, aPlay) {
		this.performance = aPerformance;
		this.play = aPlay;
	}

	get amount() {
		throw new Error('서브클래스에서 처리하도록 설계되었습니다.');
	}

	get volumeCredits() {
		let result = 0;
		result += Math.max(this.performance.audience - 30, 0);
		if ('comedy' === this.play.type)
			result += Math.floor(this.performance.audience / 5);
		return result;
	}
}

class TragedyCalculator extends PerformanceCalculator {
	get amount() {
		let result = 40000;
		if (this.performance.audience > 30) {
			result += 1000 * (this.performance.audience - 30);
		}
		return result;
	}
}

class ComedyCalculator extends PerformanceCalculator {
	get amount() {
		let result = 30000;
		if (this.performance.audience > 20) {
			result += 10000 + 500 * (this.performance.audience - 20);
		}
		result += 300 * this.performance.audience;
		return result;
	}
}

exports.createStatementData = function (invoice, plays) {
	const statementData = {};
	statementData.customer = invoice.customer;
	statementData.performances = invoice.performances.map(enrichPerformance);
	statementData.totalAmount = totalAmount(statementData);
	statementData.totalVolumeCredits = totalVolumeCredits(statementData);
	return statementData;

	function totalAmount(data) {
		// 반복문을 파이프라인으로 바꾸기
		return data.performances.reduce(
			(total, aPerformance) => total + aPerformance.amount,
			0
		);
	}

	function totalVolumeCredits(data) {
		// 반복문을 파이프라인으로 바꾸기
		return data.performances.reduce(
			(total, aPerformance) => total + aPerformance.volumeCredits,
			0
		);
	}

	function enrichPerformance(aPerformance) {
		const calculator = createPerformanceCalculator(
			aPerformance,
			playFor(aPerformance)
		);
		const result = Object.assign({}, aPerformance); // 얕은 복사
		result.play = calculator.play;
		result.amount = calculator.amount;
		result.volumeCredits = calculator.volumeCredits;
		return result;

		function playFor(aPerformance) {
			return plays[aPerformance.playID];
		}
	}
};
