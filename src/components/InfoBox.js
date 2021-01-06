import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({ title, cases, active, isRed, total, ...props }) {
	return (
		<Card
			className={`info-box ${active && 'infobox-selected'} ${
				isRed && 'infobox-selectRed'
			}`}
			onClick={props.onClick}>
			<CardContent>
				<Typography className='infobox-title' color='textSecondary'>
					{title}
				</Typography>

				<h2 className={`infobox-cases ${!isRed && 'infobox-case-green'}`}>
					{cases}
				</h2>
				<Typography className='infobox-total' color='textSecondary'>
					Total <br />
					{total}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default InfoBox;
