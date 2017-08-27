'use strict';

if (!PDFJS.PDFViewer || !PDFJS.getDocument) {
  alert('Please build the pdfjs-dist library using\n' +
        '  `gulp dist`');
}

// The workerSrc property shall be specified.
//
PDFJS.workerSrc = '../../build/dist/build/pdf.worker.js';

var DEFAULT_URL = '../../web/pdf_open_parameters.pdf';
var PAGE_TO_VIEW = 3;
var SCALE = 1.0;

var container = document.getElementById('pageContainer');
var pdfLinkService = new PDFJS.PDFLinkService(); // <--- ADDED

// Loading document.
PDFJS.getDocument(DEFAULT_URL).then(function (pdfDocument) {

  

  // Document loaded, retrieving the page.
  return pdfDocument.getPage(PAGE_TO_VIEW).then(function (pdfPage) {
    // Creating the page view with default parameters.
    var pdfPageView = new PDFJS.PDFPageView({
      container: container,
      id: PAGE_TO_VIEW,
      scale: SCALE,
      defaultViewport: pdfPage.getViewport(SCALE),
      linkSerivice: pdfLinkService,
      // We can enable text/annotations layers, if needed
      textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
      annotationLayerFactory: new PDFJS.DefaultAnnotationLayerFactory()
    });
    // Associates the actual page with the view, and drawing it
    pdfLinkService.setViewer(pdfPageView);
    pdfLinkService.setDocument(pdfDocument, null); // <--- ADDED
    pdfPageView.setPdfPage(pdfPage);
    return pdfPageView.draw();
  });
}); 