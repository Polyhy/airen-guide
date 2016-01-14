const {PropTypes} = React;
const {InputAddressWithMap, InputText, TextArea, UploadPhoto, RatingStar, ...polyhyC} = PolyhyComponent;

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
					<div className="input-item" name="input-menu" ref="inputItem"></div>
				</div>
		)
	}
});

var InputTime = React.createClass({
	changeType: function(){
		var t = $(this.refs.type).text();
		var type = t == "AM" ? "PM" : "AM";
		$(this.refs.type).text(type);
		$(this.refs.time).data('type', type);
	},
	checkValue: function(e){
		var input = this.refs.time.value;
		$(this.refs.warning).text("");
		if(isNaN(input) || input >12 || input < 1){
			this.refs.time.value = "";
			$(this.refs.warning).text("올바르지 않은 값입니다.");
		}
	},
	render: function(){
		return (
				<div style={{display: "inline-block", width: "120px", verticalAlign: "middle"}}>
					<div className="input-group">
						<div className="input-group-addon" onClick={this.changeType}
								 ref="type"
								 style={{cursor:"pointer"}}>AM</div>
						<input type="text" ref="time"
									 className="form-control" onBlur={this.checkValue}
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
			var $temp = $(this.refs.buttons).find(".btn-ok");
			$temp.removeClass("btn-ok");
			$temp.addClass("btn-default");
			$target.removeClass("btn-default");
			$target.addClass("btn-ok");

			$("#"+$target.data("type")).removeClass('hide');
			$("#"+$temp.data("type")).addClass('hide');

			$(this.refs.inputItem).find('p').remove();
			$(this.refs.inputItem).data('type', $target.data("type"))
		}
	},
	addItem: function(){
		var t = $(this.refs.buttons).find(".btn-ok").data("type");
		if(t=="rest-week-day"){
			var week = $(this.refs.inputWeek.selectedOptions).val();
			var weekDay = $(this.refs.inputWeekDay.selectedOptions).val();
			var e = "<p><i class='fa fa-calendar-o'></i> 매월 "+week+"째 주 "+weekDay+"요일</p>";
			$(this.refs.inputItem).append(e);
			$(this.refs.inputItem).find('p').on('click', function(e){
				$(this).remove();
			});
		}else{
			var date = this.refs.inputDate.value;
			if(date && !isNaN(date) && date > 1 &&date<=31)
			var e = "<p><i class='fa fa-calendar-o'></i> 매월 "+date+"일</p>";
			$(this.refs.inputItem).append(e);
			$(this.refs.inputItem).find('p').on('click', function(e){
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
						매월<input type="text" className="form-control" name="date" ref="inputDate"/>일
					</div>

					<div id="rest-week-day">
						매월
						<select className="form-control" ref="inputWeek">
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</select>째주
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
					<div className="input-item" name="input-rest" ref="inputItem" data-type="rest-week-day"></div>
				</div>
		);
	}
});





AddRestaurant = React.createClass({
	getInitialState: function(){
		return {restaurantImage: []};
	},
	componentDidMount: function(){
		$("#btn-add-restaurant").addClass('hide');
	},
	componentWillUnmount: function(){
		$("#btn-add-restaurant").removeClass('hide');
	},
	validInput: function(){
		var inputRestaurantInfo = {};
		var $addForm = $(this.refs.addForm);
		var validFlag = true;
		$addForm.find('label.warn').removeClass("warn");

		if($addForm.find('[name=name]').val()){
			inputRestaurantInfo.name = $addForm.find('input[name=name]').val();
		} else{
			$addForm.find('[for=name]').addClass('warn');
			validFlag = false;
		}

		if(this.state.restaurantImage.length){
			inputRestaurantInfo.images = this.state.restaurantImage.slice();
		} else{
			$addForm.find('[for=photo]').addClass('warn');
			validFlag = false;
		}

		if($addForm.find('[name=input-menu]').find('p').length){
			inputRestaurantInfo.menus = [];
			var $inputMenus = $addForm.find('[name=input-menu]').find('p');
			for (var i in $inputMenus){
				inputRestaurantInfo.menus.push({
					menu: $inputMenus.eq(i).find('.name'),
					price: $inputMenus.eq(i).find('.price')
				})
			}
		}else{
			$addForm.find('[for=menu-name]').addClass('warn');
			validFlag = false;
		}
		
		if($addForm.find('[name=max-member]').val()){
			inputRestaurantInfo.maxMember = $addForm.find('input[name=max-member]').val();
		} else{
			$addForm.find('[for=max-member]').addClass('warn');
			validFlag = false;
		}
		
		if($addForm.find('[name=address]').val() && $addForm.find('[name=address-detail]').val()
				&& $addForm.find('[name=address-lat]').val() && $addForm.find('[name=address-lng]').val()){
			var address = $addForm.find('[name=address]').val() + $addForm.find('[name=address-detail]').val();
			inputRestaurantInfo.address = address;
			inputRestaurantInfo.latlng = {
				lat: $addForm.find('[name=address-lat]').val(),
				lng: $addForm.find('[name=address-lng]').val()
			}
		} else{
			$addForm.find('[for=address]').addClass('warn');
			validFlag = false;
		}
		
		if($addForm.find('[name=time-start]').val() && $addForm.find('[name=time-end]').val()){
			var $open = $addForm.find('input[name=time-start]');
			if($open.data('type')=="PM"){
				if ($open.val() < 12) inputRestaurantInfo.open = $open.val()+12;
			} else if($open.val() == 12){
				inputRestaurantInfo.open = 0;
			} else{
				inputRestaurantInfo.open = $open.val();
			}
			var $close = $addForm.find('input[name=time-end]');
			if($close.data('type')=="PM"){
				if ($close.val() < 12) inputRestaurantInfo.close = $close.val()+12;
			} else if($close.val() == 12){
				inputRestaurantInfo.close = 0;
			} else{
				inputRestaurantInfo.close = $close.val();
			}
		} else{
			$addForm.find('[for=time-start]').addClass('warn');
			validFlag = false;
		}

		if($addForm.find('[name=rating-star]').val()){
			inputRestaurantInfo.rating = $addForm.find('input[name=rating-star]').val();
		} else{
			$addForm.find('[for=rating-star]').addClass('warn');
			validFlag = false;
		}

		if($addForm.find('[name=comment]').val()){
			inputRestaurantInfo.comment = $addForm.find('input[name=comment]').val();
		} else{
			$addForm.find('[for=comment]').addClass('warn');
			validFlag = false;
		}

		if($addForm.find('[name=input-rest]').find('p').length){
			var closingDays = [];
			var $inputRest = $addForm.find('[name=input-rest]').find('p');
			if($addForm.find('[name=input-rest]').data('type')=="rest-week-day"){
				var d = ["일", "월", "화", "수", "목", "금", "토"];
				for (var i=0; i<$inputRest.length; i++){
					var temp = {
						week: $inputRest.eq(i).text().match(/\d(?=째)/ig)[0],
						day: d.indexOf($inputRest.eq(i).text().match(/[일월화수목금토](?=요일)/ig)[0])
					};
					if(!closingDays.find((t)=>{if(_.isEqual(t, temp))return t; return null})){
						closingDays.push(temp);
					}
				}
			} else{
				for (var i=0; i<$inputRest.length; i++){
					var temp = $inputRest.eq(i).text().match(/[123]?\d(?=일)/ig)[0];
					if(closingDays.indexOf(temp)<0)closingDays.push(temp)
				}
			}
			inputRestaurantInfo.closingDays = closingDays;
		}


		if(validFlag){
			this.submitForm(inputRestaurantInfo);
		}else{
			$('html, body').stop().animate({
				'scrollTop': $addForm.find('label.warn').eq(0).offset().top
			}, 600, 'swing', null);
		}
	},
	submitForm: function(inputRestaurantInfo){
		console.log(inputRestaurantInfo);
	},
	render: function(){
		return (
				<div id="add-restaurant">
					<h1 className="title"><i className="fa fa-map-marker"></i> 새로운 밥집 추가</h1>
					<form id="add-restaurant-form" ref="addForm">
						<p className="warn" ref="warning"></p>

						<InputText name={"name"} label={"밥집 이름"}/>

						<UploadPhoto name={"photo"} label={"사진"}
												 count={5} images={this.state.restaurantImage}/>

						<InputMenuAndPrice />

						<div className="form-group">
							<label htmlFor="max-member">최대 인원</label>
							<div style={{width: "120px"}}>
								<div className="input-group">
									<input type="text" ref="time"
												 className="form-control"
												 name="max-member" placeholder=""/>
									<div className="input-group-addon">명</div>
								</div>
							</div>
						</div>

						<InputAddressWithMap
								label={"주소"} name={"address"} detail={true}
								placeholder={"Click Me!"}
								width={"100%"} height={"300px"}/>

						<div className="form-group">
							<label htmlFor="time-start">영업시간</label>
							<InputTime name="time-start"/> ~ <InputTime name="time-end"/>
						</div>

						<InputRestDate />

						<RatingStar name={"rating-star"} label={"별점"} starCount={3}/>

						<TextArea name={"comment"} label={"아이레너 코멘트"}/>

						{/*<InputText name={"tag"} label={"태그 (선택)"}/>*/}

						<button type="button" id="btn-submit" className="btn btn-ok"
										onClick={this.validInput}>등록하기</button>
					</form>
				</div>
		)
	}
});
