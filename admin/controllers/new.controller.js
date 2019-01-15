var New = require('../../models/new.model');

module.exports.getCreateNew = (req, res, next) =>{
	res.render('admin/news/createNew',{
			user : res.locals.account
		});
}

module.exports.postCreateNew = (req, res, next ) => {
	var avatar_around = [];
	for(let i = 0; i < req.files.length; i++){
		avatar_around.push(req.files[i].path.split('/').slice(1).join('/'));
	}
	req.body.avatar_around = avatar_around;
	New.create(req.body);
	res.redirect('/admin/news/list_news');
};

module.exports.getListNews = async (req, res, next)=>{
	try{
		var news = await New.find();

		var page = parseInt(req.query.page) || 1; // mac dinh la 1
		var perPage = 5;

		var totalPage = Math.ceil(news.length/perPage);

		var newsListPage = await New.find().limit(perPage).skip(perPage * (page-1));

		var pageNumber = [];
		if(totalPage === 1){
			pageNumber.push(1);
		}else if (totalPage === 2) {
			pageNumber.push(1,2);
		}else if (totalPage === 3) {
			pageNumber.push(1,2,3);
		}
		else{
			if(page == 1)
				pageNumber.push(page, page + 1, page + 2, 'Next', 'Last');
			else if(page > 2 && page < totalPage)
				pageNumber.push('First', 'Prev', page-1, page, page + 1, 'Next','Last');
			else if(page == totalPage)
				pageNumber.push('First', 'Prev',page -2, page -1, page);
		}

		res.render('admin/news/listNews',{
			newsList : newsListPage,
			pageNumber : pageNumber,
			lastPage : totalPage,
			page : page,
			perPage: perPage,
			user : res.locals.account
		});
	}
	catch(error){
		next(error);
	}
}