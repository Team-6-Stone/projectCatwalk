import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import axios from 'axios';
import AddAModal from './AddAModal.jsx';


class QA_listEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      limit: 2,
      answers: Object.values(this.props.item.answers),
      counter: 0,
      addA: false,
      selected: this.props.selected,
      helpfulQ: false,
      helpfulA: false
    }
    this.lmaClick = this.lmaClick.bind(this);
    this.helpfulQClick = this.helpfulQClick.bind(this);
    this.helpfulAClick = this.helpfulAClick.bind(this);
    this.onReportClick = this.onReportClick.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.item.answers !== prevProps.item.answers) {
      this.setState({
        answers: Object.values(this.props.item.answers)
      })
    }
  }

  lmaClick(e) {
    if (this.state.counter % 2 === 0) {
      this.setState({
        limit: 10
      })
      e.target.innerText = 'Collapse Answers';
      this.state.counter++;
    } else {
      this.setState({
        limit: 2
      })
      e.target.innerText = 'Load More Answers';
      this.state.counter++;
    }
  }

  helpfulQClick(e, num) {

    if (!this.state.helpfulQ) {
      var question_id = this.props.item.question_id;
      axios.put(`/questionshelpful/${question_id}`)
      .then((response) => {
        console.log('helpful Q put request successful')
        var updatednum = num + 1;
        e.target.innerText = 'Yes (' + updatednum + ')';
        this.setState({
          helpfulQ: true
        })
      })
      .catch((error) => {
        console.log(error)
      })
    } else {
      console.log('helpful Q has already been clicked')
    }

  }

  helpfulAClick(id, num, e) {

    if (!this.state.helpfulA) {
      var answer_id = id;
      axios.put(`/answerhelpful/${answer_id}`)
      .then((response) => {
        console.log('helpful A put request successful')
        var updatednum = num + 1;
        e.target.innerText = 'Yes (' + updatednum + ')';
        this.setState({
          helpfulA: true
        })
      })
      .catch((error) => {
        console.log(error)
      })
    } else {
      console.log('helpful A has already been clicked')
    }

  }

  onReportClick(id) {
    var answer_id = id;
    axios.put(`/answerreport/${answer_id}`)
    .then((response) => {
      console.log('Answer has been reported')
    })
    .catch((error) => {
      console.log(error)
    })
  }

  showModal(e) {
    this.setState({
      addA: !this.state.addA
    });
  }


  render() {
    if (this.state.answers.length > 2) {
      return (
        <div className="tv_qa_entry">
        <p className="questionBody">Q: {this.props.item.question_body} <span className="tv_anc qaModalToggle tv_underline" onClick={e => { this.showModal(); }}>Add Answer  </span><span className="tv_anc"> | </span><span className="tv_anc tv_underline" onClick={ e => this.helpfulQClick(e, this.props.item.question_helpfulness) }>Yes ({this.props.item.question_helpfulness})</span><span className="tv_anc"> Helpful? </span></p>
        <div><AddAModal show={this.state.addA} product={this.props.selected} onClose={this.showModal} question={this.props.item}/></div>
        <div>{this.state.answers.slice(this.state.offset, this.state.limit).map((answer, index) =>
          <div key={index}><p><span className="tv_bold"> A: </span> {answer.body}</p> <span className="lma">by {answer.answerer_name}, {moment(answer.date).format('MMM Do YYYY')} </span><span className="tv_ans"> | </span> <span className="tv_ans"> Helpful? </span> <span className="tv_underline" onClick={e => this.helpfulAClick(answer.id, answer.helpfulness, e)}> Yes ({answer.helpfulness}) </span><span className="tv_ans"> | </span><span className="tv_ans tv_underline" onClick={(e) => {this.onReportClick(answer.id); e.target.innerText = 'Reported'}}>Report</span></div>
          )}</div>
        <div className="lma lmalink" onClick={this.lmaClick}>Load More Answers</div>
        </div>
      )
    } else {
      return (
        <div className="tv_qa_entry">
        <p className="questionBody">Q: {this.props.item.question_body} <span className="tv_anc qaModalToggle tv_underline" onClick={e => { this.showModal(); }}>Add Answer  </span><span className="tv_anc"> | </span><span className="tv_anc tv_underline" onClick={ e => this.helpfulQClick(e, this.props.item.question_helpfulness) }>Yes ({this.props.item.question_helpfulness})</span><span className="tv_anc"> Helpful? </span></p>
        <div><AddAModal show={this.state.addA} product={this.props.selected} onClose={this.showModal} question={this.props.item}/></div>
        <div>{this.state.answers.map((answer, index) =>
          <div key={index}><p><span className="tv_bold"> A: </span> {answer.body}</p> <span className="lma">by {answer.answerer_name}, {moment(answer.date).format('MMM Do YYYY')} </span><span className="tv_ans"> | </span> <span className="tv_ans"> Helpful? </span> <span className="tv_underline" onClick={e => this.helpfulAClick(answer.id, answer.helpfulness, e)}> Yes ({answer.helpfulness}) </span><span className="tv_ans"> | </span><span className="tv_ans tv_underline" onClick={(e) => {this.onReportClick(answer.id); e.target.innerText = 'Reported'}}>Report</span></div>
          )}</div>
        </div>
      )
    }
  }
}



export default QA_listEntry;