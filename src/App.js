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

const DelButton = styled.button`
  position: absolute;
  right: 30px;
  top: 30px;
  color: white;
  border: 1px solid white;
  border-radius: 50px;
  background: transparent;
  width: 100px;
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

const Table = styled.table`
  width: 450px;
  text-align: right;
  padding-top: 30px;
  margin: 0 auto;
`;

class App extends Component {
  constructor(props) {
    super(props);

    let storageState = localStorage.getItem("state");
    let initState;

    if (storageState != null) {
      storageState = JSON.parse(storageState);
      initState = { ...storageState, date: moment(storageState.date) };
    } else {
      initState = {
        date: moment(),
        navSelected: "expanse",
        transactions: []
      };
    }

    this.state = initState;
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

  handleDelItem = () => {
    const inStorage = localStorage.removeItem("state");
    console.log(inStorage);
    // let i;
    // for (i = 0; i < localStorage.length; i++) {
    //   let inStorage = localStorage.key(i);
    //   if (inStorage.slice(0, 6) === "myWord") {
    //     console.log(inStorage);
    //   }
    // }
  };

  handleNavClick = event => {
    this.setState({
      navSelected: event.target.getAttribute("name")
    });
  };

  handleSubmitTransaction = (sum, category) => {
    const { date: TodayDate, transactions } = this.state;

    const newTransaction = {
      date: TodayDate.format("DD.MM.YYYY"),
      category,
      sum
    };

    const newTransactions = [...transactions, newTransaction];

    newTransactions.sort((a, b) => {
      const aDate = moment(a.date, "DD.MM.YYYY");
      const bDate = moment(b.date, "DD.MM.YYYY");
      return aDate.isAfter(bDate);
    });

    console.log(newTransactions);
    this.setState({ transactions: newTransactions });
  };

  componentDidUpdate() {
    const { date } = this.state;
    localStorage.setItem(
      "state",
      JSON.stringify({ ...this.state, date: date.format() })
    );
  }

  onToday = () => {
    const { transactions, date } = this.state;

    const currentMonthTransactions = transactions.filter(
      ({ date: transactionDate }) =>
        moment(transactionDate, "DD.MM.YYYY").isSame(date, "month")
    );

    const dailyMoney =
      currentMonthTransactions.reduce(
        (acc, transaction) =>
          transaction.sum > 0 ? transaction.sum + acc : acc,
        0
      ) / moment(date).daysInMonth();

    const transactionsBeforeAndInThisDay = currentMonthTransactions.filter(
      ({ date: transactionDate }) =>
        moment(transactionDate, "DD.MM.YYYY").isBefore(date, "date") ||
        moment(transactionDate, "DD.MM.YYYY").isSame(date, "date")
    );

    const expanseBeforeToday = transactionsBeforeAndInThisDay.reduce(
      (acc, { sum }) => (sum < 0 ? acc + sum : acc),
      0
    );

    const incomeBeforeToday = date.date() * dailyMoney;

    return incomeBeforeToday + expanseBeforeToday;
  };

  handleKeyPress = event => {
    if (event.key === "Enter") {
      const { onSubmit } = this.props;
      const { transaction, category } = this.state;

      onSubmit(-1 * Math.abs(parseFloat(transaction)), category);
      this.setState({ transaction: null, category: null });
    }
  };

  render() {
    const { date, navSelected, transactions } = this.state;

    return (
      <section className="App">
        <header className="App-header">
          <DelButton onClick={this.handleDelItem}>Очистить</DelButton>
          <img src={logo} className="App-logo" alt="logo" />
          <p>{date.format("DD.MM.YYYY")}</p>
          <DateLine>
            <DateButton onClick={this.handlePrevDay}>-</DateButton>
            <DateButton onClick={this.handleNextDay}>+</DateButton>
          </DateLine>
          <p>Доступно на сегодня: {Math.floor(this.onToday())} руб.</p>
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
          {navSelected === "expanse" ? (
            <Expanse onSubmit={this.handleSubmitTransaction} />
          ) : (
            <Incomes onSubmit={this.handleSubmitTransaction} />
          )}

          <Table>
            <tbody>
              {transactions
                .filter(({ date: transactionDate }) =>
                  moment(transactionDate, "DD.MM.YYYY").isSame(date, "month")
                )
                .map(({ date, sum, category }, index) => (
                  <tr key={index}>
                    <td>{date}</td>
                    <td>{sum} руб.</td>
                    <td>{category}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </header>
      </section>
    );
  }
}

export default App;
