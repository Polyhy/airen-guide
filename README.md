# airen-guide
###### 선택장애 직장인들의 점심시간을 위한 웹 어플리케이션

Meteor, MongoDB, React example

팀을 만들고 팀의 위치와 식당을 추천받고싶은 시간을 입력하면 팀원 수에 맞게 팀 주변의 식당 중 원하는 가격대의 식당을 추천  
추천 된 식당으로 투표를 진행 하게 되고 팀원 들은 추천 된 식당 중 가고 싶은 식당에 투표  
투표가 종료되거나 시작되기 전에 서버에서 해당 팀원 들에게 이메일 알림을 보냄  

#### 실행
run.sh 파일을 열어 MONGO_URL의 값을 수정 후, 아래와 같이 실행한다.  
` ./run.sh`

---

<br>
## Project Architecture  
### Software Abstraction
![](https://github.com/Polyhy/airen-guide/blob/master/software.abstraction.png)  
서버와 클라이언트는 DDP 프로토콜을 이용해 통신한다.  
DDP 프로토콜은 웹소켓을 기반으로 JSON 메시지를 주고받으며 DB와 웹 어플리케이션이 데이터를 실시간으로 공유할 수 있도록 해준다. 서버와 클라이언트는 데이터를 공유하기 위해 각각 데이터를 발행(publish) 하거나 구독(subscribe) 하며 데이터를 실시간으로 공유 한다.  

AirenGuide에서 서버는 등록된 팀들의 정보, 유저가 소속된 팀의 다른 유저의 정보(profile, email, id), 등록된 식당, 소속된 팀에서 진행중인 투표 정보를 발행한다. 클라이언트는 리액트의 각 컴포넌트가 마운트 될 때 필요한 정보를 서버에 구독 요청 하고 컴포넌트가 언마운트 될때 구독을 취소하며 실시간 웹 어플리케이션을 구현한다.  

식당 이미지와 같은 이미지 리소스는 MongoDB의 GridFS를 이용해 데이터 베이스에 저장 및 관리 한다.  

Synced Cron을 이용해 식당 추천, 투표 시작, 투표 종료와 같은 일을 스케쥴링 하고 실행하며 각 job은 생성 시 mongoDB에 저장된다. 저장된 job은 서버가 시작 될 때  등록된다.  

### Project Structure
    ~/airen-guide
	    |-- libs
	    |	|-- components
	    |	|	|-- a-polyhy-compontnt.jsx
	    |	|	|-- add-restaurants.jsx
	    |	|	|-- create-account-team.jsx
	    |	|	|-- layout.jsx
	    |	|	|-- login.jsx
	    |	|	|-- restaurant-card.jsx
	    |	|	|-- restaurants-detail.jsx
	    |	|	|-- restaurants-list.jsx
	    |	|	|-- settings.jsx
	    |	|	|__ todays-vote.jsx
	    |	|-- collections.js
	    |	|-- routes.jsx
	    |	|__ utils
	    |		|-- googleMapHelper.js
	    |		|__ userAgentUtils.js
	    |-- client
	    |	|-- libs
	    |	|	|__ utils
	    |	|-- stylesheets
	    |	|__ main.html
	    |-- server
	    |	|--	emails
	    |	|	|-- close-vote-alarm.jsx
	    |	|	|-- confirm-email.jsx
	    |	|	|__ make-vote-alarm.jsx
	    |	|--	methods
	    |	|	|-- restaurants.js
	    |	|	|-- teams.js
	    |	|	|-- users.js
	    |	|	|__ vote.js
	    |	|--	accounts.js
	    |	|--	publication.js
	    |	|--	startup.js
	    |	|__	utils
	    |__ run.sh

##### libs 
클라이언트와 서버 모두가 사용하는 코드가 있는 디렉토리  
- `collections` : 서버와 클라이언트 모두가 사용하는 mongodb collection을 선언하는 js파일  
- `component.js` : 리액트 컴포넌트 코드가 있는 디렉토리  
- `routes.jsx` : 라우터

##### client
클라이언트 코드가 있는 디렉토리  

##### server
서버 코드가 있는 디렉토리  
- `account.js` : Meteor의 user를 커스텀 하는 파일로 이메일 인증 여부와 관련 템플릿을 설정
- `publication.js` : 서버가 발행하는 데이터를 선언하는 파일
- `startup.js` : 서버가 실행되면 가장 먼저 로드되는 파일
- `methods` : 서버 메소드가 선언되어있는 js파일이 있는 디렉토리  
	 	Meteor Client에서 `Meteor.call('func name', **args)` 와 같이 호출  

### Database
##### teams
등록된 팀을 저장하는 collection
```
{
	_id: String,			// 각 document의 고유키
	name: String,			// 팀 이름
	createdAt: Date(),		// 팀 생성 날짜
	createdBy: user._id,	// 팀을 생성한 사람의 id
	address: String,		// 팀 주소
	latlng: {				// 팀 주소의 위도, 경도
		lat: Number,
		lng: Number
	}
	votes: []				// 등록된 투표배열
							// 배열의 각 요소는 투표의 시작, 종료 시간을 갖고 있다.
}
index :
	latang : 2d인덱스
```
##### restaurants  
유저들이 등록한 식당을 저장하는 collection  
```
{
	_id: String,			// 각 document의 고유키
	name: String,			// 레스토랑 이름	
	createdAt: Date(),		// 레스토랑을 등록한 날짜
	createdBy: String,		// 식당을 등록한 사람의 id
	menus: Array,			// 식당에서 판매하는 메뉴와 가격을 저장하는 배열
	maxMember: Number,		
	address: String,		// 식당 주소
	openTime: Number,
	closeTime: Number,
	rating: Number,
	comment: String,
	latlng: {				// 식당의 위도, 경도 값 2D 인덱스 사용
		lat: Number,
		lng: Number
	},
	closingDays: Array,
	closingType: String,
	tags: Array
}
index :
	latang : 2d인덱스
```
##### Todays
추천된 맛집과 팀원들의 투표 결과를 저장하는 collections
```
{
	_id: String,			// 각 document의 고유키
	createdAt: Date(),		// 투표 날짜
	teamId: String,			// 해당 투표가 진행되는 팀의 id 
	restaurants: [],		// 추천된 레스토랑
	status: Number			// 투표의 진행 여부 1이면 진행 중, 0이면 종료
};
```
