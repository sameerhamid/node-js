class APIFreatures {
	query: any;
	queryString: any;
	constructor(query: any, queryString: any) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		//---------------- BUILD THE QUERY
		// 1A) FILTERING
		const queryObj = { ...this.queryString };
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach(el => delete queryObj[el]);

		// 1B) ADVANCED FILTERING
		let queryString = JSON.stringify(queryObj);
		queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
		const parsedQuery = JSON.parse(queryString);

		// CONVERT VALUE TO NUMBER
		Object.keys(parsedQuery).forEach((key) => {
			const value = parsedQuery[key];

			if (typeof value === 'object' && value !== null) {
				Object.keys(value).forEach((op) => {
					const opValue = (value as Record<string, unknown>)[op];

					if (typeof opValue === 'string' && !isNaN(Number(opValue))) {
						(value as Record<string, number>)[op] = Number(opValue);
					}
				});
			}
		});

		this.query = this.query.find(parsedQuery);
		return this;
	}
	sort() {
		if (this.queryString.sort) {
			const sortBy = (this.queryString.sort as string).split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}
		return this;
	}

	limitFields() {
		if (this.queryString.fields) {
			const fields = this.query.fields.split(',').join(' ');
			this.query = this.query.select(fields);
		}
		this.query = this.query.select('-__v');
		return this;
	}

	paginate() {
		const page = +this.queryString.page || 1;
		const limit = +this.queryString.limit || 5;
		const skip = (page - 1) * limit;
		this.query.skip(skip).limit(limit);
		return this;
	}

}

export default APIFreatures;
