import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.article`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const InputLine = styled.div`
  display: flex;
  flex-direction: row;
  line-height: 1.5;
`;
const Input = styled.input`
  font-size: 20px;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid white;
  margin-left: 5px;
  color: white;
  width: 100%;
  padding: 0;
  margin: 0;

  &:focus,
  &:active {
    outline: none;
  }
`;
const LineTitle = styled.dt`
  width: 150px;
`;
const LineInput = styled.dd`
  width: 150px;
  margin: 0;
`;
const Button = styled.button`
  color: white;
  border: 1px solid white;
  border-radius: 31px;
  background-color: transparent;
  margin: 3px;
  cursor: pointer;
  text-align: center;
  padding: 5px 20px;

  &:focus,
  &:active {
    outline: none;
  }
`;

export class Expanse extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  state = {
    transaction: null,
    category: null
  };

  handleChangeInput = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleEnter = () => {
    const { onSubmit } = this.props;
    const { transaction, category } = this.state;

    onSubmit(-1 * Math.abs(parseFloat(transaction)), category);
    this.setState({ transaction: null, category: null });
  };

  render() {
    const { transaction, category } = this.state;
    return (
      <Container>
        <dl>
          <InputLine>
            <LineTitle>Расход:</LineTitle>
            <LineInput>
              <Input
                name="transaction"
                onChange={this.handleChangeInput}
                value={transaction || ""}
              />
            </LineInput>
          </InputLine>
          <InputLine>
            <LineTitle>Категория:</LineTitle>
            <LineInput>
              <Input
                name="category"
                onChange={this.handleChangeInput}
                value={category || ""}
              />
            </LineInput>
          </InputLine>
        </dl>
        <Button onClick={this.handleEnter}>Внести</Button>
      </Container>
    );
  }
}

export default Expanse;
