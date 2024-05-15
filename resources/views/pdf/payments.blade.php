<html>
    <head>
        <style>
            /** Define the margins of your page **/
            @page {
                margin: 100px 25px;
            }

            header {
                position: fixed;
                top: -60px;
                left: 0px;
                right: 0px;
                height: 50px;


                /** Extra personal styles **/
                text-align: center;
                line-height: 35px;
            }

            footer {
                position: fixed; 
                bottom:0px;
                text-align: right;
                font-size: 12px;
            }

            table.payments-table{
                  font-size: 10px;
                  font-family: Arial;
                  border-bottom: 1px solid #dee2e6;
                  border-right: 1px solid #dee2e6;
                  border-left: 1px solid #dee2e6;
            }

            table.payments-table thead>tr>th{
               font-size: 11px;
            }
            .text-center {
                text-align: center!important;
            }

            .footer-text {
                 width: 100%;
                 font-size: 12px;
                 text-align: right!important;
                 position:absolute;
                 bottom:0;
                 right:0;
            }
            .table {
              table-layout: fixed;
                width: 100%;
                margin-bottom: 1rem;
                color: #212529;
            }
            .table td, .table th {
                padding: 5px;
                border-top: 1px solid #dee2e6;
            }

            b, strong {
                font-weight: bolder;
            }
             
             .pagenum:before {
                    content: counter(page);
            }

        </style>
    </head>
    <body>
        <!-- Define header and footer blocks before your content -->
        <header>
            <h4> Payments</h4>
        </header>

        <footer>
            {{ \Carbon\Carbon::now()->format('m-d-Y') }} - Page <span class="pagenum"></span>
        </footer>

        <main>
          <table id="project-types-table" class="table table-hover text-center payments-table">
              <thead>
              <tr class="text-danger">
              @if($columns->asset_type_id)
              <th >Asset Type</th>
              @endif 
              @if($columns->asset_model_id)
              <th >Asset Name</th>
              @endif 
              @if($columns->property_type_id)   
              <th >Property Type</th>
              @endif 
              @if($columns->property_id)   
              <th >Property</th>
              @endif 
              @if($columns->area_id)
              <th >Area </th>
              @endif 
              @if($columns->sub_area_id)
              <th >Sub Area </th>
              @endif 
              @if($columns->vendor_id)
              <th >Vendor  </th>
              @endif 
              @if($columns->contractor_id)
              <th >Contractor </th>
              @endif 
              @if($columns->tenant_id)
              <th >Tenant </th>
              @endif 
              @if($columns->work_type_id)
              <th >Work Type </th>
              @endif 
              @if($columns->payment)
              <th >Payment </th>
              @endif 
              @if($columns->payment_date)
              <th >Payment Date </th>
              @endif 
              @if($columns->brand)
              <th >Brand </th>
              @endif 
              @if($columns->description)
              <th >Description </th>
              @endif
               @if($columns->non_asset)
              <th >Non Asset </th>
              @endif 
                </tr>
                </thead>
                <tbody>
 
                  @foreach($items as $item)
                      <tr class="text-danger">
                       @if($columns->asset_type_id)
                       <th >{{$item->asset_type_name}}</th>
                       @endif 
                       @if($columns->asset_model_id)
                       <th >{{$item->asset_model_name}}</th>
                       @endif 
                       @if($columns->property_type_id)
                       <th >{{$item->property_name}}</th>
                       @endif
                        @if($columns->property_id)
                       <th >{{$item->property_type_name}}</th>
                       @endif 
                       @if($columns->area_id)
                       <th >{{$item->area_name}}</th>
                       @endif 
                       @if($columns->sub_area_id)
                       <th >{{$item->sub_area_name}}</th>
                       @endif 
                       @if($columns->vendor_id)
                       <th >{{$item->vendor_name}}</th>
                       @endif 
                       @if($columns->contractor_id)
                       <th >{{$item->contractor_name}}</th>
                       @endif 
                       @if($columns->tenant_id)
                       <th >{{$item->tenant_name}}</th>
                       @endif 
                       @if($columns->work_type_id)
                       <th >{{$item->work_type_name}}</th>
                       @endif 
                       @if($columns->payment)
                       <th >{{$item->payment}}</th>
                       @endif 
                       @if($columns->payment_date)
                       <th >{{$item->payment_date}}</th>
                       @endif 
                       @if($columns->brand)
                       <th >{{$item->brand}}</th>
                       @endif  
                       @if($columns->description)
                       <th >{{$item->description}}</th>
                       @endif  

                       @if($columns->non_asset)
                       <th >{{$item->non_asset}}</th>
                       @endif 
                      </tr>

                  @endforeach
                  
                   <tr class="text-danger">
                    <th colspan="100%"></th>
                   </tr>
                   <tr class="text-danger">
                     <th style="text-align: right;"colspan="100%"> Total : ${{$grandTotal}}</th>
                     <!-- <th >Total</th>
                     <th >${{$grandTotal}} </th> -->
                    </tr>
                </tbody>
                </table> 
       </main>
    </body>
</html>