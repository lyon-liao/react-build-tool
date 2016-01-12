import React from 'react';
import { connect } from 'react-redux';
import Footer from '../components/footer';
import Header from '../components/header';
import request from 'superagent';
import {Star} from '../components/star';

import CommentAdd from '../components/comment_add';
import moment from 'moment';
import {CaseShow} from './case_show';


function loadCases(company){

    return dispatch => {
        request.get(`/api/companies/${company._id}/cases`)
            .end((err, res) => {
                if(err){
                    return console.log(err);
                }

                if(res.body.status == 0){
                    dispatch({
                        type: 'INIT_CASES',
                        cases: res.body.data
                    });
                }else{
                    console.log(res.body.message);
                }
            });
    }
}

function loadQuotation(company){

    return dispatch => {
        request.get(`/api/companies/${company._id}/quotations`)
            .end((err, res) => {
                if(err){
                    return console.log(err);
                }

                if(res.body.status == 0){
                    dispatch({
                        type: 'INIT_QUOTATIONS',
                        quotations: res.body.data
                    });
                }else{
                    console.log(res.body.message);
                }
            });
    }
}

function loadComment(company){

    return dispatch => {
        request.get(`/api/companies/${company._id}/comments`)
            .end((err, res) => {
                if(err){
                    return console.log(err);
                }

                if(res.body.status == 0){
                    dispatch({
                        type: 'INIT_COMMENTS',
                        comments: res.body.data
                    });
                }else{
                    console.log(res.body.message);
                }
            });
    }
}

function addComment(comment){

    return dispatch => {
        request.post(`/api/companies/${comment.company}/comments`)
            .send(comment)
            .end((err, res) => {
                if(err){
                    return console.log(err);
                }

                if(res.body.status == 0){
                    dispatch({
                        type: 'ADD_COMMENT',
                        comment: res.body.data
                    });
                }else{
                    console.log(res.body.message);
                }
            });
    }
}

class Case extends React.Component{

    showCase(caseInfo) {
        var showCaseHander = this.props.showCaseHander;
        if(showCaseHander){
            showCaseHander(caseInfo);
        }
    }


    render(){
        var {caseInfo} = this.props;
        return (
            <div className="case-item inline" onClick={this.showCase.bind(this, caseInfo)}>
                <img src={'/' + caseInfo.img_urls[0].url} alt="" className="case-img"/>
                <div className="case-title">{caseInfo.title}</div>
            </div>
        );
    }
}

class Quotation extends React.Component{

    render(){
        var {quotation} = this.props;
        return (
            <div className="quotation-item inline">
                <img src={'/' + quotation.img_urls[0].url} alt="" className="quotation-img"/>
                <div className="quotation-info">
                    <div className="name">{quotation.name}</div>
                    <div className="price">{quotation.price}</div>
                </div>
            </div>
        );
    }
}

class Comment extends React.Component{

    render(){
        var {comment} = this.props;
        return (
            <div className="comment-item">
                <div className="avatar-box inline">
                    <img src={'/' + comment.user.avatar} alt="" className="avatar"/>
                </div>
                <div className="body inline">
                    <div className="name-and-date">
                        <div className="name inline-b">{comment.user.name}</div>
                        <div className="date inline-b">{moment(comment.creat_date).format('YYYY-MM-DD')}</div>
                    </div>
                    <Star score={comment.score}></Star>
                    <div className="content">{comment.content}</div>
                </div>
            </div>
        );
    }
}

class CompanyShow extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            commentDialogOpen: false,
            selectCase: null
        }
    }

    componentDidMount(){
        var {initData, dispatch} = this.props;
        dispatch({
            type: 'INIT_STORE',
            company: initData.company
        });

        dispatch(loadCases(initData.company));
        dispatch(loadQuotation(initData.company));
        dispatch(loadComment(initData.company));
    }
    showCommentAdd(){
        this.setState({
            commentDialogOpen: true
        });
    }

    showCase(caseObj){
        this.setState({
            selectCase: caseObj
        });
    }

    createComment(comment){
        var {currentUser, company, dispatch} = this.props;
        comment.company = company._id;
        if(currentUser){
            comment.user = currentUser._id;
        }

        dispatch(addComment(comment));
        this.setState({
            commentDialogOpen: false
        });

    }
    render(){

        var {company, cases, quotations, comments} = this.props;
        company.services_type = company.services_type || [];

        var serviceType = company.services_type.map((item, index) => {
            return (
                <span key={index} className="item">{item}</span>
            );
        });

        var cases = cases.map((item, index) => {
            return (
                <Case key={index} caseInfo={item} showCaseHander={this.showCase.bind(this)}></Case>
            );
        });

        var quotations = quotations.map((item, index) => {
            return (
                <Quotation quotation={item} key={index}></Quotation>
            );
        });

        var comments = comments.map((item, index) => {
            return (
                <Comment comment={item} key={index}></Comment>
            );
        })

        return (
            <div className="container">
                <Header></Header>
                <div className="company-show-container">
                    <div className="company-home-page">
                        <img src={'/' + company.company_img} alt="" className="head-img"/>
                        <div className="company-info w-1000 s-center inline-container">
                            <div className="left-side inline">
                                <div className="company-logo inline">
                                    <img src={'/' + company.company_logo} alt="" className="logo"/>
                                </div>
                                <div className="name-and-service inline">
                                    <div className="name">{company.name}</div>
                                    <div className="services">
                                        <div className="service-title inline">服务项目：</div>
                                        <div className="service-items inline">
                                            {serviceType}

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="right-side inline">
                                <div className="concat-user-info">
                                    <div className="name">{company.contacts}</div>
                                    <div className="phone-number">{company.phone_number || company.tel}</div>
                                </div>
                                <hr className="line"/>
                                <p className="address">{company.address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="company-about inline-container w-1000 s-center">
                        <div className="left-side inline">
                            <div className="section-title">关于此服务商</div>
                            <div className="content">
                                {company._description}
                            </div>
                        </div>
                        <div className="right-side inline">
                            <div className="btn-container">
                                <button>收藏此服务商</button>
                            </div>
                        </div>
                    </div>

                    <section className="company-cases w-1000 s-center">
                        <div className="section-title">成功案例展示</div>
                        <div className="cases-container">
                            {cases}
                        </div>
                        <button className="btn-load-more">查看更多</button>
                        <CaseShow caseInfo={this.state.selectCase} className="case-show-container"></CaseShow>
                    </section>
                    <section className="company-services w-1000 s-center">
                        <div className="section-title">产品或服务</div>
                        <div className="services-container">
                            {quotations}
                        </div>
                        <button className="btn-load-more">查看更多</button>
                    </section>
                    <div className="bg-fff">
                        <div className="comment-list w-1000 s-center">
                            <div className="section-title">
                                <div className="title inline-b">客户评价</div>
                                <div className="action inline-b">
                                    <i className="add-icon"></i>
                                    <span onClick={this.showCommentAdd.bind(this)}>我要点评</span>
                                    <CommentAdd isOpen={this.state.commentDialogOpen} onDataSubmit={this.createComment.bind(this)}></CommentAdd>
                                </div>
                            </div>

                            <div className="comment-container">
                                {comments}
                            </div>
                            <button className="btn-load-more">查看更多</button>
                        </div>
                    </div>
                </div>
                <Footer></Footer>
            </div>
        );
    }
}



function headerState({companyShow, authService}) {
    return {
        currentUser: authService.currentUser,
        company: companyShow.company,
        cases: companyShow.cases,
        quotations: companyShow.quotations,
        comments: companyShow.comments
    };
}

export default connect(headerState)(CompanyShow);
