RestaurantDetail = React.createClass({
	subItems: [],
	mixins: [ReactMeteorData],
	restaurant: null,
	getMeteorData: function(){
		return {
			restaurant: Restaurants.findOne({_id: this.props.restaurantId})
		}
	},
	getInitialState: function(){
		this.subItems.push(Meteor.subscribe('restaurants'));
		this.subItems.push(Meteor.subscribe('restaurants-image'));
		return {
			restaurant: Restaurants.findOne({_id: this.props.restaurantId})
		}
	},
	componentWillMount: function(){
		this.restaurant = this.data.restaurant? this.data.restaurant: this.state.restaurant;
	},
	componentWillUnmount: function(){
		for(var i=0; i<this.subItems.length; i++){
			this.subItems[i].stop();
		}
	},
	getImageURL: function(imageId){
		var image = RestaurantImages.findOne({_id: imageId});
		return image? image.url().split("?")[0]: "";
	},
	renderHeaderImage: function(restaurnatImages){
		var index = 0, tempW = 1, tempH = 1;
		return restaurnatImages.map(image=>{
			index += 1;
			if(index<restaurnatImages.length)index%2==0? tempH *= 2: tempW *= 2;
			return (
				<div className="responsive-image head-images" key={"img-"+index}
						 style={{	backgroundImage: "url("+this.getImageURL(image)+")",
						 				 	width: (100/tempW)+"%",
						 				 	height: (100/tempH)+"%"}}></div>
			)
		});
	},
	renderTags: function(){
		var tags = this.restaurant.tags? this.restaurant.tags.slice(): [];
		var index = 0;
		return tags.map(tag=><span key={"tag-"+index++}><i className="fa fa-hashtag"></i>{tag}</span>);
	},
	renderMenu: function(){
		var i=0;
		return this.restaurant.menus.map(m=>(
				<tr className="menu-itme" key={i++}>
					<td className="menu">{m.menu}</td>
					<td className="price"><i className="fa fa-krw"></i>{m.price}</td>
				</tr>
		));
	},
	renderStar: function(count){
		return _.range(3).map(i=>i<count?
				<span className="star y" key={"star-"+i}><i className="fa fa-star"/></span>:
				<span className="star n" key={"star-"+i}><i className="star-o" className="fa fa-star-o"/></span>
		);
	},
	renderRestDay: function(){
		var i = 0;
		var weeks = ["일", "월", "화", "수", "목", "금", "토"];
		if (this.restaurant.closingType == "rest-date")
			return this.restaurant.closingDays.map(d=>(
				<p className="rest-day" key={i++}>매월 {d} 일</p>
			));
		else if (this.restaurant.closingType == "rest-week-day")
			return this.restaurant.closingDays.map(d=>(
				<p className="rest-day" key={i++}>매월 {d.week}주 {weeks[d.day]}요일</p>
			));
		else return <p className="rest-day">연중 무휴</p>
	},
	render: function(){
		return (
				<div id="restaurant-detail">
					<h1 className="title">
						<i className="fa fa-chevron-circle-left" onClick={()=>history.back()}
							 style={{cursor:"pointer"}}/>
						{this.restaurant.name}
					</h1>
					<div className="head-images-container">
						{this.renderHeaderImage(this.restaurant.images)}
						<div className="tag-list">
							<div>{this.renderTags()}</div>
							<span style={{fontSize: "16px",fontWeight: "200",
														position: "absolute",right: "0px",bottom: "18px",
														textDecoration: "underline", color: "#bbb",cursor: "pointer"}}>
								폐업/이전 신고
							</span>
						</div>
					</div>
					<div className="article article-1">
						<p className="title">대표 메뉴</p>
						<div className="contents">
							<table style={{width:"50%"}}>
								<tbody>{this.renderMenu()}</tbody>
							</table>
						</div>
						<p className="title">아이렝 스타</p>
						<div className="contents">{this.renderStar(this.restaurant.rating)}</div>
						<p className="title">아이레너 코멘트</p>
						<div className="contents">{this.restaurant.comment}</div>
					</div>
					<div className="map-wrapper">
						<PolyhyComponent.Map width={"100%"} height={"100%"}
																 lat={this.restaurant.latlng.lat}
																 lng={this.restaurant.latlng.lng}
																 zoom={18} marker={true}/>
					</div>
					<div className="article article-2">
						<p className="title">주소</p>
						<div className="contents">{this.restaurant.address}</div>
						<p className="title">오픈 ~ 마감</p>
						<div className="contents">{this.restaurant.openTime+" ~ "+this.restaurant.closeTime}</div>
						<p className="title">휴무일</p>
						<div className="contents">
							{this.renderRestDay()}
						</div>
					</div>
					<div className="gallery-wrapper">
						<PolyhyComponent.ImageGallery
								imageURLs={this.restaurant.images.map(i=>this.getImageURL(i))}
								imageSize={100}/>
					</div>
				</div>
		)
	}
});