import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

//circle color
const casesTypeColors = {
	cases: {
		hex: '#cc1034',
		multiplier: 800,
	},

	recovered: {
		hex: '#7dd71d',
		multiplier: 1200,
	},

	deaths: {
		hex: '#fb4443',
		multiplier: 2000,
	},
};

//sort sidepanel data
export const sortData = (data) => {
	const sortedData = [...data];
	sortedData.sort((a, b) => {
		if (a.cases > b.cases) {
			return -1;
		} else {
			return 1;
		}
	});
	return sortedData;
};

//
export const printStat = (stat) =>
	stat ? `+${numeral(stat).format('0,0')}` : '+0';

export const printStatTotal = (stat) =>
	stat ? `${numeral(stat).format('0,0')}` : '+0';

// interactive map circle map
export const showDataOnMap = (data, casesType = 'cases') =>
	data.map((country) => (
		<Circle
			center={[country.countryInfo.lat, country.countryInfo.long]}
			fillOpacity={0.4}
			color={casesTypeColors[casesType].hex}
			fillColor={casesTypeColors[casesType].hex}
			radius={
				Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
			}>
			<Popup>
				<div className='popup-container'>
					<div
						className='popup-flag'
						style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
					/>
					<div className='popup-countryname'>{country.country}</div>
					<div className='popup-cases'>
						Cases: {numeral(country.cases).format('0,0')}
					</div>
					<div className='popup-recovered'>
						Recovered: {numeral(country.recovered).format('0,0')}
					</div>
					<div className='pop-deaths'>
						Deaths: {numeral(country.deaths).format('0,0')}
					</div>
				</div>
			</Popup>
		</Circle>
	));

export default sortData;
