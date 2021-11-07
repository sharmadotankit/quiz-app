import './App.css';
import NavigationBar from './Components/NavigationBar/NavigationBar';
import Footer from './Components/Footer/Footer';
import QuizTest from "./Components/QuizTest/QuizTest";
import SignIn from "./Components/SignIn/SignIn";
import Register from "./Components/Register/Register"
import Report from './Components/Report/Report';
import { Component } from 'react';
import Subject from './Components/Subject/Subject';
import MyReports from './Components/MyReports/MyReports';

class App extends Component {
  constructor() {
    super();
    this.state = {
      route: 'signin',
      isSignedIn: false,
      testInfo: {
        subject: '',
        level: '',
      },
      score: 0,
      user: {
        id: '',
        name: '',
        email: '',
      },
      reports: []
    }
  }


  loadUser = (user) => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  }

  loadReports = () => {
    fetch("http://localhost:4001/report/" + this.state.user.email)
      .then(response => response.json())
      .then(data => {
        this.setState({ reports: data })
        this.onRouteChange('myresult')
      })
      .catch(err => alert("Error fetching reports"))
  }

  // printState = () =>{
  //   console.log(this.state);
  // }

  onRouteChange = (route) => {
    if (route === 'home' || route === 'report') {
      this.setState({ isSignedIn: true })
    }
    else if (route === 'signin' || route === 'register') {
      this.setState({ isSignedIn: false })
    }

    this.setState({ route: route });
  }

  goToResult = (score) => {
    fetch("http://localhost:4001/storereport", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: this.state.testInfo.subject,
        level: this.state.testInfo.level,
        status: (score > 50) ? "Passed" : "Failed",
        score: score,
        email: this.state.user.email
      })
    })
      .then(response => response.json())
      .then(console.log)
      .catch(err => console.log)

    this.setState({ score: score })
    this.onRouteChange('report')
  }


  setTestInfo = (testInfoReceived) => {
    this.setState(
      {
        testInfo: {
          subject: testInfoReceived.subject,
          level: testInfoReceived.level,
        }
      })
  }




  render() {
    return (
      <div className="App">
        <header>
          <NavigationBar onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} loadReports={this.loadReports} />
        </header>
        <section className="marginForNav">
          {this.state.route === 'home' ? <Subject onRouteChange={this.onRouteChange} setTestInfo={this.setTestInfo} />
            : this.state.route === 'signin' ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
              : this.state.route === 'register' ? <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
                : this.state.route === 'quizTest' ? <QuizTest goToResult={this.goToResult} testInfo={this.state.testInfo} onRouteChange={this.onRouteChange} />
                  : this.state.route === "myresult" ? <MyReports reports={this.state.reports} />
                    : <Report score={this.state.score} testInfo={this.state.testInfo} user={this.state.user} />}
        </section>
        <footer>
          <Footer />
        </footer>


      </div>
    );
  }
}

export default App;
