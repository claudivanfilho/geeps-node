mongo : {
 development: {
 	connectionString: 'mongodb://localhost/geeps',
 },
 production: {
 	connectionString: 'your_production_connection_string',
 }
}

module.export = mongo;