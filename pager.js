async function makePager(req, model, dbQuery, currentPage, perPage) {
    const maxPageDisplay = 8;
    let pager = {
        page: parseInt(currentPage, 10) || 1,
        pages: 0,
        startPage: 0,
        endPage: 0,
        results: []
    };

    try {
        const resCount = await model.count(dbQuery);
        pager.pages = Math.ceil(resCount / perPage);

        if (pager.page > pager.pages) {
            pager.page = pager.pages;
        }

        dbQuery.offset = (pager.page - 1) * perPage;
        
        // Make postgres shutup
        if(dbQuery.offset < 0)
            dbQuery.offset = 0;

        pager.results = await model.findAll(dbQuery);
    } catch (error) {
        console.log(error.message);
        throw error; // throw for outside error handling to deal with
    }

    // Pager
    pager.startPage = Math.max(1, pager.page - 4);
    pager.endPage = Math.min(pager.pages, pager.startPage + maxPageDisplay - 1);

    if (pager.pages > maxPageDisplay) {
        const diff = maxPageDisplay - (pager.endPage - pager.startPage + 1);
        pager.startPage = Math.max(1, pager.startPage - diff);
    }

    // Convert to integers for consistency
    pager.startPage = parseInt(pager.startPage, 10);
    pager.endPage = parseInt(pager.endPage, 10);
    pager.pages = parseInt(pager.pages, 10);

    return pager;
}

// TODO: pager function that just takes an array of data

module.exports = {
    makePager
}