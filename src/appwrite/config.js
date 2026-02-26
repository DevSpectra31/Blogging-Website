import conf from "../config/conf.js";
import { Client,ID,Databases,Storage,Query } from "appwrite";


export class Service{
    client=new Client();
    Databases;
    Storage;
    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwiteProjectId)
        this.databases=new Databases(this.client);
        this.storage=new Storage(this.client);
    }
    async createPost({title,slug,content,feeaturedImage,status,userId}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    feeaturedImage,
                    status,
                    userId
                }
            )
        } catch (error) {
            console.error("error in creating post : ",error)
            
        }
    }

    async updatePost(slug,{title,content,feeaturedImage,status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    feeaturedImage,
                    status,
                }

            )
        } catch (error) {
            console.error("error in updating the post");
        }
    }
    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
            return true;
        } catch (error) {
            console.error("Post Deleting error : ",error);
            return false;
        }
    }

    async getPost(slug){
        try {
            return await this.databases.listDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
        } catch (error) {
            console.error("Error in listing post : ",error)
        }
    }
    //dont want all the post.
    //fetch those post whose status=active
    //for that you have use queries
    async getPosts(queries=[Query.equal("status","active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            )  
        } catch (error) {
            console.error("error in getting post: ",error)
        }
    }

    //file upload method
    async uploadFile(file){
        try {
            return await this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
            )
        } catch (error) {
            console.error("Error in uploading file : ",error);
        }
    }
    //deletefile upload
    async deleteFile(fileId){
        try {
            await this.storage.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        } catch (error) {
            console.error("error in deleting file");
            return false;
        }
    }
    //file preview
    filePreview(fileId){
        try {
            return this.storage.filePreview(
                conf.appwriteBucketId,
                fileId,
            )
        } catch (error) {
            console.error("Error in preview file");
        }
    }
}
const service=new Service()
export default service;