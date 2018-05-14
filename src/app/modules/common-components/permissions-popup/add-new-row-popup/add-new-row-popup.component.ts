import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../../core/database/user.service';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, first, map, mergeMap} from 'rxjs/operators';

@Component({
    selector: 'app-add-new-row-popup',
    templateUrl: './add-new-row-popup.component.html',
    styleUrls: ['./add-new-row-popup.component.scss']
})
export class AddNewRowPopupComponent implements OnInit {

    @ViewChild('inputField')
    inputField: ElementRef;

    // Here we store the result character
    public result: any;

    public notFound = false;

    public input: string;

    public loading = false;

    constructor(private userService: UserService) {
    }

    private doSearch(): void {
        this.loading = true;
        // If this is an email
        if (this.input.indexOf('@') > -1) {
            this.userService.getUserByEmail(this.input)
                .pipe(
                    first(),
                    mergeMap(user => this.userService.getCharacter(user.$key)
                        .pipe(map(character => ({character: character, user: user}))))
                )
                .subscribe(data => {
                    this.notFound = false;
                    this.result = data;
                    this.loading = false;
                }, err => {
                    this.notFound = true;
                    this.loading = false;
                });
        } else {
            // Else, handle it as a user id
            this.userService.get(this.input)
                .pipe(
                    first(),
                    mergeMap(user => this.userService.getCharacter(user.$key)
                        .pipe(map(character => ({character: character, user: user}))))
                )
                .subscribe(data => {
                    this.notFound = false;
                    this.result = data;
                    this.loading = false;
                }, err => {
                    this.notFound = true;
                    this.loading = false;
                });
        }
    }

    public ngOnInit(): void {
        fromEvent(this.inputField.nativeElement, 'keyup')
            .pipe(
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(() => this.doSearch());
    }

}
