const { gql } = require('apollo-server-express');
//s
const typeDefs = gql`
    type Query {
        user : String
        login(phone : String!, password : String!) : operation!,
        getAllMultimedia(page :Int, limit : Int) : [Multimedia],
        getAllCategory( input : InputGetCategory ) : [Category],
        getAllBrand(input :InputGetBrand):[Brand!]!,
        getAllSurvey(categoryId:ID!): [Survey!]!
    }

    type Mutation {
        register(phone : String!, password : String!) : operation!,
        mutimedia(image : Upload!) : operation!,
        category(input : InputCategory):operation!,
        brand(input :InputBrand):operation!,
        survey(input: InputSurvey):operation!
    }
    input InputSurvey{
        list:[InputSurveyList!]!
    }
    input InputSurveyList{
        category:ID!,
        name:String,
        label:String
    }
    input InputGetBrand{
        page:Int, 
        limit:Int,
        category:ID,
        getAll:Boolean =true
    }
    input InputBrand{
        name:String!,
        label:String,
        category:[ID!]!,
        image:Upload!
    }
    input InputGetCategory {
        page : Int,
        limit : Int,
        mainCategory : Boolean,
        parentCategory : Boolean,
        catId : ID
    }
    input InputCategory {
        name : String!,
        label : String,
        parent : ID,
        image : ID!
    }

    type operation {
        status : Int,
        message : String,
        token : String
    }

    type Multimedia {
        _id:ID,
        name : String,
        dimWidth : String,
        dimHeight : String,
        format : String,
        dir : String,
        createdAt : Date
    }
    type Category {
        _id : ID,
        name : String,
        label : String,
        parent :Parent,
        image : Multimedia
    }
    type Parent {
        _id : ID,
        name : String,
        label : String,
        parent : Category
    }
    type Brand{
       _id:ID,
       category:[Category],
       name: String,
       label: String,
       image:String
        
    }
    type Survey{
        _id:ID,
        category:Category,
        name:String,
        label:String
    }
    scalar Date
`;

module.exports = typeDefs
