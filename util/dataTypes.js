exports.event = {
		collection: 'events',
		multiSelectFields: ['tags'],
		dates: {eventDate: true},
		newForm: {
				type: 'event',
				eventDate: '',
				name:'',
				description:'',
				tags:[]
			}
	};