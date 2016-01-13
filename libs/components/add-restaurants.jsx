const {PropTypes} = React;
const {InputAddressAndMap, InputText, TextArea, AddPhoto, RatingStar, ...polyhyC} = PolyhyComponent;

var InputMenuAndPrice = React.createClass({
	appenItem: function(event){
		var inputMenuName = this.refs.menuName.value;
		var inputMenuPrice = this.refs.menuPrice.value;
		if(inputMenuName && inputMenuPrice && !isNaN(inputMenuPrice) && parseInt(inputMenuPrice)>0){
			var e = "<p><i class='fa fa-cutlery'></i> <span class='name'>"+inputMenuName+"</span> - <span class='price'>"+inputMenuPrice+"</span>원</p>";
			$(this.refs.inputItem).append(e);
			$(this.refs.inputItem).children('p').on('click', function(e){
				$(this).remove();
			});
			this.refs.menuName.value = "";
			this.refs.menuPrice.value = "";
		}
	},
	render: function(){
		return(
				<div className="form-group add-paired-item">
					<label htmlFor="menu-name" style={{display: "block"}}>메뉴</label>
					<div className="append-item-form">
						<div className="input-group">
							<div className="input-group-addon">메뉴이름</div>
							<input type="text" ref="menuName"
										 className="form-control"
										 name="menu-name" placeholder=""/>
						</div>
						<div className="input-group">
							<div className="input-group-addon">가격 ({String.fromCharCode(8361)})</div>
							<input type="text" ref="menuPrice"
										 className="form-control"
										 name="menu-price" placeholder=""/>
						</div>
						<div style={{textAlign: "right"}}>
							<button type="button" className="btn btn-default" onClick={this.appenItem}>추가</button>
						</div>
					</div>
					<div className="input-item" name="input-item" ref="inputItem"></div>
				</div>
		)
	}
});

var InputTime = React.createClass({
	changeType: function(){
		var t = $(this.refs.type).text();
		var type = t == "AM" ? "PM" : "AM";
		$(this.refs.type).text(type);
	},
	render: function(){
		return (
				<div style={{display: "inline-block", width: "120px", verticalAlign: "middle"}}>
					<div className="input-group">
						<div className="input-group-addon" onClick={this.changeType}
								 ref="type"
								 style={{cursor:"pointer"}}>AM</div>
						<input type="text" ref="time"
									 className="form-control"
									 name={this.props.name} placeholder=""/>
					</div>
				</div>
		);
	}
});

var InputRestDate = React.createClass({
	changeType: function(e){
		var $target = $(e.target);
		if(!$target.hasClass("btn-ok")){
			var $temp = $(this.refs.buttons).children(".btn-ok");
			$temp.removeClass("btn-ok");
			$temp.addClass("btn-default");
			$target.removeClass("btn-default");
			$target.addClass("btn-ok");

			$("#"+$target.data("type")).removeClass('hide');
			$("#"+$temp.data("type")).addClass('hide');

			$(this.refs.inputItem).children('p').remove();
		}
	},
	addItem: function(){
		var t = $(this.refs.buttons).children(".btn-ok").data("type");
		if(t=="rest-week-day"){
			var week = $(this.refs.inputWeek.selectedOptions).val();
			var weekDay = $(this.refs.inputWeekDay.selectedOptions).val();
			var e = "<p><i class='fa fa-calendar-o'></i> 매월 "+week+"째 주 "+weekDay+"요일</p>";
			$(this.refs.inputItem).append(e);
			$(this.refs.inputItem).children('p').on('click', function(e){
				$(this).remove();
			});
		}else{
			var date = this.refs.inputDate.value;
			if(date && !isNaN(date) && date > 1 &&date<=31)
			var e = "<p><i class='fa fa-calendar-o'></i> 매월 "+date+"일</p>";
			$(this.refs.inputItem).append(e);
			$(this.refs.inputItem).children('p').on('click', function(e){
				$(this).remove();
			});
		}
	},
	render: function(){
		return(
				<div className="form-group">
					<label>휴무일</label>
					<div className="btn-group" role="group" aria-label="..." ref={"buttons"}>
						<button type="button" className="btn btn-ok"
										onClick={this.changeType} data-type="rest-week-day">요일별</button>
						<button type="button" className="btn btn-default"
										onClick={this.changeType} data-type="rest-date">날짜별</button>
					</div><br/>

					<div id="rest-date" className="hide">
						매월
						<input type="text" className="form-control"
									 name="date" ref="inputDate"/>
						일
					</div>

					<div id="rest-week-day">
						매월
						<select className="form-control" ref="inputWeek">
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</select>째주{/*String.fromCharCode(160)+String.fromCharCode(160)*/}
						<select className="form-control" ref="inputWeekDay">
							<option value="월">월</option>
							<option value="화">화</option>
							<option value="수">수</option>
							<option value="목">목</option>
							<option value="금">금</option>
							<option value="토">토</option>
							<option value="일">일</option>
						</select>요일
					</div>
					<button type="button" className="btn btn-default"
									style={{marginLeft: "30px"}} onClick={this.addItem}>추가</button>
					<div className="input-item" name="input-item" ref="inputItem"></div>
				</div>
		);
	}
});

AddRestaurant = React.createClass({
	componentDidMount: function(){
		$("#btn-add-restaurant").addClass('hide');
	},
	render: function(){
		return (
				<div id="add-restaurant">
					<h1 className="title"><i className="fa fa-map-marker"></i> 새로운 밥집 추가</h1>
					<form id="add-restaurant-form">
						<InputText name={"name"} label={"밥집 이름"}/>
						<AddPhoto name={"photo"} label={"사진"}/>
						<InputMenuAndPrice />
						<InputAddressAndMap
								label={"주소"} name={"address"}
								placeholder={"Click Me!"}
								width={"100%"} height={"300px"}/>
						<div className="form-group">
							<label>영업시간</label>
							<InputTime name="time-start"/> ~ <InputTime name="time-end"/>
						</div>
						<InputRestDate />
						<RatingStar name={"rating-star"} label={"별점"} starCount={3}/>
						<TextArea name={"comment"} label={"아이레너 코멘트"}/>
						<TextArea name={"tag"} label={"태그 (선택)"}/>
						<button type="button" id="btn-submit" className="btn btn-ok">등록하기</button>
					</form>
				</div>
		)
	}
});
