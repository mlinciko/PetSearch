import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { IDxFormItems } from 'src/app/models/models';
import { CommonService } from 'src/app/services/common.service';
import { IFilter, initialFilterData } from '../../models/filter.interface';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
  providers: [CommonService],
})
export class FilterPanelComponent implements OnInit {
  @ViewChild('form') form!: DxFormComponent;
  formItems!: IDxFormItems;
  formData: IFilter = initialFilterData;
  
  params: HttpParams = new HttpParams();
  @Output() onReload: EventEmitter<HttpParams> = new EventEmitter();
  constructor(
    private common: CommonService,
  ) { }

  ngOnInit(): void {
    this.initFormItems();
  }

  initFormItems(): void {
    this.formItems = [
      {
        itemType: "group",
        colCount: 2,
        items: [
          {
            itemType: "group",
            caption: "Search",
            colSpan: 1,
            items: [
              {
                editorType: 'dxTextBox',
                dataField: 'search',
                colSpan: 1,
                label: { text: 'Search', visible: false },
                editorOptions: {
                  labelMode: 'floating',
                  onInput: (e: any): void => {
                    this.configureParams(e.component.option("text"), "search");
                  }
                },
              },
            ]
          },
          {
            itemType: "group",
            caption: "Filters",
            colSpan: 1,
            items: [
              {
                itemType: "group",
                colCount: 3,
                items: [
                  {
                    editorType: 'dxSelectBox',
                    dataField: 'pet_id',
                    colSpan: 1,
                    label: { text: 'Pet', visible: false },
                    editorOptions: {
                      dataSource: this.common.createSelectSource("pet"),
                      labelMode: 'floating',
                      valueExpr: "pet_id",
                      displayExpr: "name",
                      onValueChanged: (e: any): void => {
                        this.configureParams(e.value, "pet_id");
                      }
                    },
                  },
                  {
                    editorType: 'dxSelectBox',
                    dataField: 'city_id',
                    colSpan: 1,
                    label: { text: 'City', visible: false },
                    editorOptions: {
                      dataSource: this.common.createSelectSource("city"),
                      labelMode: 'floating',
                      valueExpr: "city_id",
                      displayExpr: "name",
                      onValueChanged: (e: any): void => {
                        this.configureParams(e.value, "city_id");
                      }
                    },
                  },
                  {
                    editorType: 'dxSelectBox',
                    dataField: 'status_id',
                    colSpan: 1,
                    label: { text: 'Status', visible: false },
                    editorOptions: {
                      dataSource: this.common.createSelectSource("status"),
                      labelMode: 'floating',
                      valueExpr: "status_id",
                      displayExpr: "name",
                      onValueChanged: (e: any): void => {
                        this.configureParams(e.value, "status_id");
                      }
                    },
                  }
                ]
              },
            ]
          },
        ]
      }
    ]
  }

  configureParams(value: number | string, key: string): void {
    if (this.params.has(key)) {
      this.params = this.params.delete(key);
    }
    this.params = this.params.append(key, value.toString())
    this.onReload.emit(this.params);
  }

}
