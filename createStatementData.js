// 조건부 로직을 다형성으로 바꾸기
class PerformanceCalculator {
	constructor(aPerformance, aPlay) {
		this.performance = aPerformance;
		this.play = aPlay;
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
		const calculator = new PerformanceCalculator(
			aPerformance,
			playFor(aPerformance)
		);
		const result = Object.assign({}, aPerformance); // 얕은 복사
		result.play = calculator.play;
		result.amount = amountFor(result);
		result.volumeCredits = volumeCreditsFor(result);
		return result;

		function volumeCreditsFor(aPerformance) {
			let result = 0;
			result += Math.max(aPerformance.audience - 30, 0);
			if ('comedy' === aPerformance.play.type)
				result += Math.floor(aPerformance.audience / 5);
			return result;
		}

		function playFor(aPerformance) {
			return plays[aPerformance.playID];
		}

		function amountFor(aPerformance) {
			let result = 0;
			switch (aPerformance.play.type) {
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
					throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
			}
			return result;
		}
	}
};
