import React, { Component } from "react";
// import logo from './logo.svg';
import "./App.css";
import TopBar from "./components/TopBar/TopBar";
import SideBar from "./components/SideBar/SideBar";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Modal from "./components/Modal/Modal";
import MyProfile from "./components/MyProfile/MyProfile";
import PeopleProfile from './components/People/PeopleProfile';
import * as userService from "./services/userService";
// import * as peopleService from "./services/peopleService";
import CreateProfileForm from './components/CreateProfileForm/CreateProfileForm';
import Blogs from './components/Blogs/Blogs';
import PeopleRoute from './components/People/PeopleRoute';
import LaunchPage from './components/LaunchPage/LaunchPage';
import Footer from './components/Footer/Footer';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalContent: null,
      showRegForm: false,
      showLogInForm: false,
      currentUserName: '',
      currentUser: {},
      currentProfileId: null,
      isLoggedIn: false,
      launchPage: true,
      currentPage: '',
      email: '',
      password: ''
    }
  }

  navigateToContent = (page) =>{
    this.setState({
      launchPage: false,
      isLoggedIn: true,
      navigate: page
    })
  }

  getCurrentUser = data =>{
    this.setState({
      currentUser: data
    })
  }

  showModal = () => {
    this.setState({ showModal: true });
  }

  hideModal = () => {
    this.setState({ showModal: false });
  }

  showRegForm = () =>{
    this.setState({
      launchPage: false,
      showRegForm: true,
      showLogInForm: false
    })
  }

  showLogInForm = () =>{
    this.setState({
      launchPage: true,
      showRegForm: false,
      showLogInForm: true
    })
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }

  logInBtnClicked = event =>{
    event.preventDefault();
    let logInData = {
      email: this.state.email,
      password: this.state.password
    }
    userService.loginFunc(logInData)
    .then(this.successLogIn)
    .then(this.enterMyProfile)
    .catch(this.failLogIn)
  }

  successLogIn = () =>{
    this.setState({
      showModal: true,
      showLogInForm: false,
    })
    console.log('success log in')
  }


  enterMyProfile = () =>{
    setInterval(()=>{this.setState({
      launchPage: false,
      isLoggedIn: true
    })}, 2000)
  }


  failLogIn = () =>{
    console.log('fail log in')
  }

  logOutBtnClicked = event =>{
    event.preventDefault();
    userService.logoutFunc()
    .then(this.successLogOut)
    .catch(this.failLogOut)
  }

  successLogOut = () =>{
    window.location.assign('/');
    this.setState({
      isLoggedIn: false,
      launchPage: true
    })
    console.log('success log out')
  }

  failLogOut = () =>{
    console.log('fail log out')
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route render={() => <TopBar logInBtnClicked={this.logInBtnClicked} logOutBtnClicked={this.logOutBtnClicked} handleChange={this.handleChange} logInState={this.state} showLogInForm={this.showLogInForm}/>} />
          
          {this.state.isLoggedIn?null:<Route path="/" render={() => <LaunchPage launch={this.state.launchPage} showRegForm={this.showRegForm}/>} />}
          {this.state.showRegForm?<Route component={RegisterForm} />:null}
          <main className={this.state.showModal?"modal-background":null}>
            {this.state.isLoggedIn?<Route render={()=> <SideBar currentPage={this.state.navigate}/>}/>: null}
            <Route path="/MyProfile" render={() => <MyProfile onChange={this.findCurrentUser} currentUserName={this.state.currentUserName} navigateToContent={this.navigateToContent} getCurrentUser={this.getCurrentUser}/>} />
            <Route path="/PeopleProfile" render={() => <PeopleProfile navigateToContent={this.navigateToContent} currentUser={this.state.currentUser}/>} />
            <Route path="/PeopleProfile/:id" component={PeopleRoute} />
            <Route path="/ProfileForm" render={()=> <CreateProfileForm navigateToContent={this.navigateToContent} currentUser={this.state.currentUser}/>} />
            <Route path="/Blogs" render={()=> <Blogs navigateToContent={this.navigateToContent}/>} />
            
          </main>
          <Modal show={this.state.showModal} handleClose={this.hideModal} />
          {this.state.launchPage?<Footer />:null}
        </div>
      </Router>
    );
  }
}

export default App;
