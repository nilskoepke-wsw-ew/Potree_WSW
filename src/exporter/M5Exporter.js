import {Measure} from "../utils/Measure.js";

export class M5Exporter{

    static formatCoord(value, width = 15, decimals = 4) {
		// Beispiel: "     374405.3860"
		return value.toFixed(decimals).padStart(width, " ");
	}

    static measurementToM5(measurement, adrIndex = 1) {

		let lines = [];
	
		let coords = measurement.points.map(e => e.position.toArray());

		for (let i = 0; i < coords.length; i++) {

			let x = coords[i][0] + Potree.coordinateOffset.x;
			let y = coords[i][1] + Potree.coordinateOffset.y;
			let z = coords[i][2] + Potree.coordinateOffset.z;

			let pointNumber = measurement.pointNumber[i] + 71000000;

			// Punktcode wird ignoriert → durch Leerzeichen ersetzen
			let emptyCode = "              "; // exakt 14 Leerzeichen

			let line =
				`For M5|Adr ${String(adrIndex).padStart(5, " ")}|PI1 ${pointNumber}${emptyCode}U  N |` +
				`Y ${this.formatCoord(x, 15)} m   |` +
				`X ${this.formatCoord(y, 15)} m   |` +
				`Z ${this.formatCoord(z, 10)} m   |`;

			lines.push(line);

		}

		return lines;
	}

	static toString(measurements) {

		if (!(measurements instanceof Array)) {
			measurements = [measurements];
		}

		measurements = measurements.filter(m => m instanceof Measure);

		let lines = [];
		
		for (let measure of measurements) {

			let m5lines = this.measurementToM5(
				measure
			);

			lines.push(...m5lines);

		}

		return lines.join("\n");
	}

}
