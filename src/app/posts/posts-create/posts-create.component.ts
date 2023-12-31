import { Component, OnInit } from "@angular/core";
import { Post} from "../posts.model";
import { NgForm } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";

@Component({
    selector: 'app-posts-create',
    templateUrl: './posts-create.component.html',
    styleUrls: ['./posts-create.component.css']
})
export class PostsCreateComponent implements OnInit{
    enteredTitle = '';
    enteredContent = '';
    private mode = 'create';
    private postId: string;
    post: Post;
    isLoading = false;

    constructor(public postsService: PostsService, public route: ActivatedRoute){}

    ngOnInit(){
        this.route.paramMap.subscribe( (paramMap: ParamMap) => {
            if(paramMap.has('postId')){
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postsService.getPost(this.postId).subscribe((postData) => {
                    this.isLoading = false;
                    this.post = {id: postData._id, title: postData.title, content: postData.content}
                });
            }
            else{
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onSavePost(form: NgForm){
        if(form.invalid){
            return;
        }
        this.isLoading = true;
        if(this.mode == 'create'){
            this.postsService.addPost(form.value.title, form.value.content);
        }
        else{
            this.postsService.updatePost(this.postId, form.value.title, form.value.content)
        }
        form.resetForm();
    }
}