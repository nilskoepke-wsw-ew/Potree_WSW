
export class CSVExporter {
	static toString (points) {
		let string = '';

		let attributes = Object.keys(points.data)
			.filter(a => a !== 'normal')
			.sort((a, b) => {
				if (a === 'position') return -1;
				if (b === 'position') return 1;
				if (a === 'rgba') return -1;
				if (b === 'rgba') return 1;
			});

		let headerValues = [];
		for (let attribute of attributes) {
			let itemSize = points.data[attribute].length / points.numPoints;

			if (attribute === 'position') {
				headerValues = headerValues.concat(['x', 'y', 'z']);
			} else if (attribute === 'rgba') {
				headerValues = headerValues.concat(['r', 'g', 'b', 'a']);
			} else if (itemSize > 1) {
				for (let i = 0; i < itemSize; i++) {
					headerValues.push(`${attribute}_${i}`);
				}
			} else {
				headerValues.push(attribute);
			}
		}
		string = headerValues.join(', ') + '\n';

		let coord = "x";

		for (let i = 0; i < points.numPoints; i++) {
			let values = [];

			for (let attribute of attributes) {
				let itemSize = points.data[attribute].length / points.numPoints;
				let value = points.data[attribute]
					.subarray(itemSize * i, itemSize * i + itemSize)
					.join(', ');
				
				if (attribute === 'position') {
					let coordArray = value.split(", ");
					coordArray[0] = Number(coordArray[0]) + Potree.coordinateOffset.x;
					coordArray[1] = Number(coordArray[1]) + Potree.coordinateOffset.y;
					coordArray[2] = Number(coordArray[2]) + Potree.coordinateOffset.z;

					coordArray[0] = coordArray[0].toFixed(3);
					coordArray[1] = coordArray[1].toFixed(3);
					coordArray[2] = coordArray[2].toFixed(3);
	
					value = coordArray.join(", ");
				}

				values.push(value);
			}

			string += values.join(', ') + '\n';
		}

		return string;
	}
};
