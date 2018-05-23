import React, { Component } from 'react'
import keyIndex from 'react-key-index'

import '../stylesheets/mergedstyles.css'

class SelectableUnit extends Component {
	
	render() {
		/**
		The available units

		@property selectableUnits
		*/
		var s = [
			{
			    text: 'ETHER',
			    value: 'ether'
			},
			{
			    text: 'FINNEY', //(µΞ)
			    value: 'finney'
			},
			{
			    text: 'BTC',
			    value: 'btc'
			},
			{
			    text: 'USD',
			    value: 'usd'
			},
			{
			    text: 'EUR',
			    value: 'eur'
			},
			{
			    text: 'GBP',
			    value: 'gbp'
			},
			{
			    text: 'BRL',
			    value: 'brl'
			}
		];

		var selectableUnits = keyIndex(s, 1)

		return (
			<div className="simple-modal">
				<ul>
					 { 
					 	Object.keys(selectableUnits).map((item, i) => {
					 		const s = selectableUnits[item]
					 		const t =  s.text
					 		const v =  s.value
							return (
								<li key={ s._textId }>
									<button key={ s._valueId } data-value={ v }> 
										{ t } 
									</button> 
								</li>)
						})
					 }
				</ul>
			</div>
		)
	}
}

export default SelectableUnit