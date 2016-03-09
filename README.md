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
