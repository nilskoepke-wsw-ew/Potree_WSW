

import {Utils} from "../../utils.js";

export class MeasurePanel{

	constructor(viewer, measurement, propertiesPanel){
		this.viewer = viewer;
		this.measurement = measurement;
		this.propertiesPanel = propertiesPanel;

		this._update = () => { this.update(); };
	}

	createCoordinatesTable(points){
		let table = $(`
			<table class="measurement_value_table">
				<tr>
					<th>x</th>
					<th>y</th>
					<th>z</th>
					<th></th>
				</tr>
			</table>
		`);

		let copyIconPath = Potree.resourcePath + '/icons/copy.svg';

		for (let point of points) {
			// wsw
			let newX = point.x;
			let newY = point.y;
			let newZ = point.z;

			let xoff = newX + Potree.coordinateOffset.x;
			let yoff = newY + Potree.coordinateOffset.y;
			let zoff = newZ + Potree.coordinateOffset.z;
						
			let x = Utils.addCommas(xoff.toFixed(3));
			let y = Utils.addCommas(yoff.toFixed(3));
			let z = Utils.addCommas(zoff.toFixed(3));
			// end wsw
			
			let row = $(`
				<tr>
					<td><span>${x}</span></td>
					<td><span>${y}</span></td>
					<td><span>${z}</span></td>
					<td align="right" style="width: 25%">
						<img name="copy" title="copy" class="button-icon" src="${copyIconPath}" style="width: 16px; height: 16px"/>
					</td>
				</tr>
			`);

			this.elCopy = row.find("img[name=copy]");
			this.elCopy.click( () => {
				// wsw
				let coordArr = [x, y, z];
				let msg = coordArr.join(", ");
				// end wsw
				Utils.clipboardCopy(msg);

				this.viewer.postMessage(
					`Copied value to clipboard: <br>'${msg}'`,
					{duration: 3000});
			});

			table.append(row);
		}

		return table;
	};

	createAttributesTable(){
		let elTable = $('<table class="measurement_value_table"></table>');

		let point = this.measurement.points[0];
		
		for(let attributeName of Object.keys(point)){
			if(attributeName === "position"){
			
			}else if(attributeName === "rgba"){
				let color = point.rgba;
				let text = color.join(', ');

				elTable.append($(`
					<tr>
						<td>rgb</td>
						<td>${text}</td>
					</tr>
				`));
			}else{
				let value = point[attributeName];
				let text = value.join(', ');

				elTable.append($(`
					<tr>
						<td>${attributeName}</td>
						<td>${text}</td>
					</tr>
				`));
			}
		}

		return elTable;
	}

	update(){

	}
};
