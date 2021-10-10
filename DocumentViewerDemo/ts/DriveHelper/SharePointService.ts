/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {

   export module DriveHelper {

      export module LTSharePoint {

         export class SharePointServerProperties {
            // Server uri
            public uri: string;
            // Credentials
            public useCredentials: boolean;
            public userName: string;
            public password: string;
            public domain: string;
         }

         export class SharePointItem {
            public name: string;
            public type: ItemType;
         }

         export enum ItemType {
            File,
            Folder
         }

         export interface GetDocumentsListItemRequest extends lt.Document.Service.Request {
            serverProperties: SharePointServerProperties;
            folderUri: string;
         }

         export interface GetDocumentsListItemResponse extends lt.Document.Service.Response {
            items: SharePointItem[];
         }

         export interface DownloadFileRequest extends lt.Document.Service.Request {
            serverProperties: SharePointServerProperties;
            fileUri: string;
         }

         export interface DownloadFileResponse extends lt.Document.Service.Response {
            data: string
         }

         export interface UploadFileRequest extends lt.Document.Service.Request {
            serverProperties: SharePointServerProperties;
            fileUri: string;
            name: string;
            folderUri: string;
         }

         export class SharePointService {

            private static _className: string = "SharePointService";
            private static _controllerName: string = "SharePoint";

            public static getDocumentsListItems(serverProperties: SharePointServerProperties, folderUri: string): JQueryPromise<SharePointItem[]> {
               // Create Endpoint URL using serviceUri
               var endpointUrl = lt.Document.Service.Custom.createEndpointUrl(SharePointService._controllerName, "GetDocumentsListItems");

               // Create POST settings using URL and params
               var settings = lt.Document.Service.Custom.createPostAjaxSettings<GetDocumentsListItemRequest>(endpointUrl, {
                  serverProperties: serverProperties,
                  folderUri: folderUri,
                  userData: lt.Document.DocumentFactory.serviceUserData
               });

               // Create deferred (promise)
               var d: JQueryDeferred<SharePointItem[]> = $.Deferred<SharePointItem[]>();

               // Call PrepareAjax and execute request
               lt.Document.Service.Custom.requestAjax<GetDocumentsListItemResponse>(this, SharePointService._className, "GetDocumentsListItems", settings)
                  .done((response) => {
                     // Access userData here if needed
                     d.resolve(response.items);
                  })
                  .fail(d.reject);

               return d.promise();
            }

            public static downloadFile(serverProperties: SharePointServerProperties, fileUri: string): JQueryPromise<string> {
               // Create Endpoint URL using serviceUri
               var endpointUrl = lt.Document.Service.Custom.createEndpointUrl(SharePointService._controllerName, "DownloadFile");

               // Create POST settings using URL and params
               var settings = lt.Document.Service.Custom.createPostAjaxSettings<DownloadFileRequest>(endpointUrl, {
                  serverProperties: serverProperties,
                  fileUri: fileUri,
                  userData: lt.Document.DocumentFactory.serviceUserData
               });

               // Create deferred (promise)
               var d: JQueryDeferred<string> = $.Deferred<string>();

               // Call PrepareAjax and execute request
               lt.Document.Service.Custom.requestAjax<DownloadFileResponse>(this, SharePointService._className, "DownloadFile", settings)
                  .done((response) => {
                     // Access userData here if needed
                     d.resolve(response.data);
                  })
                  .fail(d.reject);

               return d.promise();
            }

            public static uploadFile(serverProperties: SharePointServerProperties, fileUri: string, name: string, folderUri: string): JQueryPromise<void> {
               // Create Endpoint URL using serviceUri
               var endpointUrl = lt.Document.Service.Custom.createEndpointUrl(SharePointService._controllerName, "UploadFile");

               // Create POST settings using URL and params
               var settings = lt.Document.Service.Custom.createPostAjaxSettings<UploadFileRequest>(endpointUrl, {
                  serverProperties: serverProperties,
                  fileUri: fileUri,
                  name: name,
                  folderUri: folderUri,
                  userData: lt.Document.DocumentFactory.serviceUserData
               });

               // Create deferred (promise)
               var d: JQueryDeferred<void> = $.Deferred<void>();

               // Call PrepareAjax and execute request
               lt.Document.Service.Custom.requestAjax<void>(this, SharePointService._className, "UploadFile", settings).done(d.resolve).fail(d.reject);
               return d.promise();
            }
         }
      }
   }
}