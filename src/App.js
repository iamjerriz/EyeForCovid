import React, { useState, useEffect } from 'react';
import InfoBox from './components/InfoBox';
import Map from './components/Map/Map';
import Table from './components/SidePanel/Table';
import LineGraph from './components/SidePanel/LineGraph';
import { sortData, printStat, printStatTotal } from './util';
import {
	MenuItem,
	FormControl,
	Select,
	Card,
	CardContent,
} from '@material-ui/core';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState('worldWide');
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapCenter, setMapCenter] = useState({ lat: 34.8074, lng: 40.4796 });
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([]);
	const [casesType, setCasesType] = useState('cases');

	// https://disease.sh/v3/covid-19/countries

	// userEffect = runs piece of code base on given condition
	// will only run once as component loads and will not run again

	useEffect(() => {
		fetch('https://disease.sh/v3/covid-19/all')
			.then((response) => response.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);

	useEffect(() => {
		// async sends  request , and wait for it  so use aync
		const getCountriesData = async () => {
			await fetch('https://disease.sh/v3/covid-19/countries')
				.then((response) => response.json()) //gets the data in a json formant
				.then((data) => {
					//what to do with data
					const countries = data.map((country) => ({
						name: country.country, //countrynamebasedonAPi
						value: country.countryInfo.iso2, //country shortcut name
					}));
					const sortedData = sortData(data);
					setTableData(sortedData);
					setMapCountries(data);
					setCountries(countries);
				});
		};
		getCountriesData();
	}, []);

	const onCountryChange = (event) => {
		const countryCode = event.target.value;
		// console.log('countrryyy codee', countryCode);
		setCountry(countryCode);

		const url =
			countryCode === 'worldWide'
				? 'https://disease.sh/v3/covid-19/all'
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		fetch(url)
			.then((response) => response.json()) //turns it into data text
			.then((data) => {
				// use data to do
				setCountry(countryCode);
				setCountryInfo(data);

				setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
				setMapZoom(4);
			});
	};

	console.log('countryInfo >>>', countryInfo);

	return (
		// using bem a //HEADER
		<div className='app'>
			<div className='app__left'>
				<div className='app__header'>
					<h1>EyeForCovid</h1>
					<FormControl className='app__dropdown'>
						<Select
							variant='outlined'
							onChange={onCountryChange}
							value={country}>
							<MenuItem value='worldWide'>Worldwide</MenuItem>
							{countries.map((country, key = 'idx') => (
								<MenuItem key={key} value={country.value}>
									{country.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>

				{/* 3 mid panel */}
				{/* <h3>as of Today</h3> */}
				<div className='app__stats'>
					<InfoBox
						isRed
						active={casesType === 'cases'}
						onClick={(e) => setCasesType('cases')}
						title='Cases'
						cases={printStat(countryInfo.todayCases)}
						total={printStatTotal(countryInfo.cases)}
					/>
					<InfoBox
						active={casesType === 'recovered'}
						onClick={(e) => setCasesType('recovered')}
						title='Recovered'
						cases={printStat(countryInfo.todayRecovered)}
						total={printStatTotal(countryInfo.recovered)}
					/>
					<InfoBox
						isRed
						active={casesType === 'deaths'}
						onClick={(e) => setCasesType('deaths')}
						title='Deaths'
						cases={printStat(countryInfo.todayDeaths)}
						total={printStatTotal(countryInfo.deaths)}
					/>
				</div>
				{/* map */}
				<Map
					casesType={casesType}
					countries={mapCountries}
					center={mapCenter}
					zoom={mapZoom}
				/>
			</div>

			<Card className='app__right'>
				<CardContent>
					<h3>Live cases by Country</h3>
					<Table countries={tableData} />
					<h3>worldwide new {casesType}</h3>
					<LineGraph className='app__graph' casesType={casesType} />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
