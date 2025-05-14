/**class APIFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        let keyword = this.queryStr.keyword ?{
            name:{
                $regex: this.queryStr.keyword,
                $options: 'i'

            }
        }:{};

         this.query.find({...keyword}) 
        return this;
    }

    filter(){
        const queryStrCopy = { ...this.queryStr };
        
        //removing fields from query
        const removeFields =['keyword','limit','page'];
        removeFields.forEach(field => queryStrCopy[field]);

        let queryStr = JSON.stringify(queryStrCopy);
        queryStr =  queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        this.query.find(JSON.parse(queryStr));

        return this;
    }

    paginate(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1; // Default page is 1
        const skip = resPerPage *(currentPage - 1) ; // Correct calculation for skip
        
        this.query = this.query.limit(resPerPage).skip(skip); // Apply limit and skip to query
        return this;
       
    }
}
/** */

class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        let keyword = this.queryStr.keyword
            ? {
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: 'i', // Case-insensitive
                  },
              }
            : {};

        console.log("Search Filter:", keyword); // Debug log
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryStrCopy = { ...this.queryStr };

        // Remove specified fields
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(field => delete queryStrCopy[field]);

        // Modify operators for MongoDB
        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        console.log("Filter Query:", JSON.parse(queryStr)); // Debug log
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    paginate(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1; // Default to page 1
        const skip = resPerPage * (currentPage - 1); // Calculate skip value

        console.log(`Paginating - Page: ${currentPage}, Skip: ${skip}, Limit: ${resPerPage}`); // Debug log
        this.query = this.query.limit(resPerPage).skip(skip); // Apply limit and skip
        return this;
    }
}



module.exports = APIFeatures;