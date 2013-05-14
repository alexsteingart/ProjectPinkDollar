

exports.calendarFormats = [
						{name:'January',
							noDays: function(year){return 31;}
						}, 
						{name:'February',
							noDays: function(year){return year%4==0?29:28;}
						},
						{name:'March',
							noDays: function(year){return 31;}
						},
						{name:'April',
							noDays: function(year){return 30;}
						},
						{name:'May',
							noDays: function(year){return 31;}
						},
						{name:'June',
							noDays: function(year){return 30;}
						},
						{name:'July',
							noDays: function(year){return 31;}
						},
						{name:'August',
							noDays: function(year){return 31;}
						},
						{name:'September',
							noDays: function(year){return 30;}
						},
						{name:'October',
							noDays: function(year){return 31;}
						},
						{name:'November',
							noDays: function(year){return 30;}
						},
						{name:'Decmeber',
							noDays: function(year){return 31;}
						}];