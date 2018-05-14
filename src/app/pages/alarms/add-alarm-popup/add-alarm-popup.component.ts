import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BellNodesService} from '../../../core/data/bell-nodes.service';
import {fromEvent, Observable} from 'rxjs';
import {MatDialogRef} from '@angular/material';
import {LocalizedDataService} from '../../../core/data/localized-data.service';
import {debounceTime, map} from 'rxjs/operators';

@Component({
    selector: 'app-add-alarm-popup',
    templateUrl: './add-alarm-popup.component.html',
    styleUrls: ['./add-alarm-popup.component.scss']
})
export class AddAlarmPopupComponent implements OnInit {

    itemName: string;

    @ViewChild('searchInput')
    searchInput: ElementRef;

    results: Observable<any[]>;

    constructor(private bellNodesService: BellNodesService, private dialogRef: MatDialogRef<AddAlarmPopupComponent>,
                private localizedDataService: LocalizedDataService) {
    }

    close(node: any): void {
        this.dialogRef.close(node);
    }

    ngOnInit() {
        this.results = fromEvent(this.searchInput.nativeElement, 'keyup')
            .pipe(
                debounceTime(250),
                map(() => {
                    return this.bellNodesService.getNodesByItemName(this.itemName);
                }),
                map((nodes) => {
                    return nodes.map(node => {
                        node.zoneId = this.localizedDataService.getAreaIdByENName(node.zone);
                        node.placeId = this.localizedDataService.getAreaIdByENName(node.title);
                        return node;
                    })
                })
            );
    }

}
