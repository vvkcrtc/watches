import React from 'react';
import AnalogClock from './AnalogClock.js';


class WatchForm extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = { 
      name: "",
      timezone: "",
      clocks: [],
    }
  
    this.timezoneChange = this.timezoneChange.bind(this)
    this.nameChange = this.nameChange.bind(this)    
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  
  timezoneChange(event) {
    this.setState({ timezone: event.target.value });
  }
  nameChange(event) {
    this.setState({ name: event.target.value });
  }
    
  handleSubmit(event) {
    this.state.clocks.push({id: this.state.clocks.length, name: this.state.name, tz: this.state.timezone, });
    this.setState({ timezone: 0 });
    this.setState({ name: '' });
    event.preventDefault();
  }
  
  delete(value) {
    let clocks = this.state.clocks.slice();  
    clocks.splice(clocks.indexOf(value), 1);
    this.setState({clocks});  
  }
  
  outClocks() {
    let arr = this.state.clocks.map(el=>
      <li key={el.id} className="ClkLi">
        <div align="right">
          <button className="ButtonCls" onClick={this.delete.bind(this, el)}>X</button>
        </div>
        <p className="OutText">{el.name}</p>      
        <p className="OutText">GMT {el.tz>0 ? "+"+el.tz : "-"+el.tz}</p>
        <div>
          <AnalogClock id = {`clock_${el.id}}`} tz ={el.tz} width = {150} height = {150} />
        </div>
      </li>
      );
      return arr; 
    }
  
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="FormStyle">
          <div>
            <table>
              <tr>
                <th> <label>Название</label></th>
                <th><label>Временная зона</label></th>
                <th> </th>
              </tr>
              <tr>
                <td>
                  <input type="text"  className="InputStyle" 
                  value={this.state.name} onChange={this.nameChange} />
                </td>
                <td>
                  <input type="number" className="InputStyle" value={this.state.timezone}
                  onChange={this.timezoneChange} />
                </td>
                <td>
                  <button type="submit" className="InputStyle" value="Добавить">Добавить</button>
                </td>
              </tr>
            </table>
            <ul className="ClkUl">   
              {this.outClocks()}
            </ul>
          </div>
        </form>
      </div>
    )
  }
}

export default WatchForm;
  