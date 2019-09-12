import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import moment from "moment";
import styled from "styled-components";
import Expanse from "./Expanse";
import Incomes from "./Incomes";

const DateButton = styled.button`
  color: white;
  border: ${1 + 1}px solid white;
  border-radius: 50%;
  background: transparent;
  width: 32px;
  height: 32px;
  margin: 3px;
  cursor: pointer;
  text-align: center;

  &:hover {
    border-color: #5ed2f1;
  }

  &:focus,
  &:active {
    outline: none;
  }
`;

const DateLine = styled.div`
  display: flex;
  align-items: center;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  font-size: 25px;
  padding: 40px 0 15px;
`;

const Link = styled.span`
  cursor: pointer;
  color: white;
  margin: 0 8px;
  border-bottom: ${({ selected }) => (selected ? "2px solid white" : "none")};
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: moment(),
      navSelected: "expanse"
    };
  }

  handlePrevDay = () => {
    this.setState({
      date: this.state.date.subtract(1, "day")
    });
  };

  handleNextDay = () => {
    this.setState({
      date: this.state.date.add(1, "day")
    });
  };

  handleNavClick = event => {
    this.setState({
      navSelected: event.target.getAttribute("name")
    });
  };

  render() {
    const { date, navSelected } = this.state;

    return (
      <section className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{date.format("DD.MM.YYYY")}</p>
          <DateLine>
            <DateButton onClick={this.handlePrevDay}>-</DateButton>
            <DateButton onClick={this.handleNextDay}>+</DateButton>
          </DateLine>
          <Nav>
            <Link
              name="expanse"
              onClick={this.handleNavClick}
              selected={navSelected === "expanse"}
            >
              Расходы
            </Link>
            <Link
              name="incomes"
              onClick={this.handleNavClick}
              selected={navSelected === "incomes"}
            >
              Доходы
            </Link>
          </Nav>
          {navSelected === "expanse" ? <Expanse /> : <Incomes />}
        </header>
      </section>
    );
  }
}

export default App;
