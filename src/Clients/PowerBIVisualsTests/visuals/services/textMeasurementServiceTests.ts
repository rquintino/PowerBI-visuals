﻿/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved. 
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*   
*  The above copyright notice and this permission notice shall be included in 
*  all copies or substantial portions of the Software.
*   
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/

/// <reference path="../../_references.ts"/>

module powerbitests {
    import TextProperties = powerbi.TextProperties;
    import TextMeasurementService = powerbi.TextMeasurementService;

    describe("Text measurement service", () => {
        let Ellipsis = '…';

        describe('measureSvgTextElementWidth', () => {
            it('svg text element', () => {
                var element = $("<text>")
                    .text("PowerBI rocks!")
                    .css({
                        "font-family": "Arial",
                        "font-size": "11px",
                        "font-weight": "bold",
                        "font-style": "italic",
                        "white-space": "nowrap",
                    });
                attachToDom(element);

                let width = TextMeasurementService.measureSvgTextElementWidth(<any>element.get(0));
                expect(width).toBeGreaterThan(50);
            });
        });

        it("measureSvgTextWidth", () => {
            var getTextWidth = (fontSize: number) => {
                var textProperties: TextProperties = {
                    fontFamily: "Arial",
                    fontSize: fontSize + "px",
                    text: "PowerBI rocks!",
                };

                return TextMeasurementService.measureSvgTextWidth(textProperties);
            };

            expect(getTextWidth(10)).toBeLessThan(getTextWidth(12));
        });

        it("estimateSvgTextHeight", () => {
            var getTextHeight = (fontSize: number) => {
                var textProperties: TextProperties = {
                    fontFamily: "Arial",
                    fontSize: fontSize + "px",
                    text: "PowerBI rocks!",
                };

                return TextMeasurementService.estimateSvgTextHeight(textProperties);
            };

            expect(getTextHeight(10)).toBeLessThan(getTextHeight(12));
        });

        it("measureSvgTextHeight", () => {
            var getTextHeight = (fontSize: number) => {
                var textProperties: TextProperties = {
                    fontFamily: "Arial",
                    fontSize: fontSize + "px",
                    text: "PowerBI rocks!",
                };
                return TextMeasurementService.measureSvgTextHeight(textProperties);
            };

            expect(getTextHeight(10)).toBeLessThan(getTextHeight(12));
        });

        it("getMeasurementProperties", () => {
            var element = $("<text>")
                .text("PowerBI rocks!")
                .css({
                    "font-family": "Arial",
                    "font-size": "11px",
                    "font-weight": "bold",
                    "font-style": "italic",
                    "white-space": "nowrap",
                });
            attachToDom(element);

            var properties = TextMeasurementService.getMeasurementProperties(element);
            var expectedProperties: TextProperties = {
                fontFamily: "Arial",
                fontSize: "11px",
                fontWeight: "bold",
                fontStyle: "italic",
                whiteSpace: "nowrap",
                text: "PowerBI rocks!",
            };

            expect(properties).toEqual(expectedProperties);
        });

        describe("getSvgMeasurementProperties", () => {
            it("svg text element", () => {
                var svg = $("<svg>");
                var element = $("<text>")
                    .text("PowerBI rocks!")
                    .css({
                        "font-family": "Arial",
                        "font-size": "11px",
                        "font-weight": "bold",
                        "font-style": "italic",
                        "white-space": "nowrap",
                    });
                svg.append(element);
                attachToDom(svg);

                var properties = TextMeasurementService.getSvgMeasurementProperties(<any>element[0]);
                var expectedProperties: TextProperties = {
                    fontFamily: "Arial",
                    fontSize: "11px",
                    fontWeight: "bold",
                    fontStyle: "italic",
                    whiteSpace: "nowrap",
                    text: "PowerBI rocks!",
                };

                expect(properties).toEqual(expectedProperties);
            });
        });

        describe('getTailoredTextOrDefault', () => {
            it("without ellipsis", () => {
                var properties: TextProperties = {
                    fontFamily: "Arial",
                    fontSize: "11px",
                    fontWeight: "bold",
                    fontStyle: "italic",
                    whiteSpace: "nowrap",
                    text: "PowerBI rocks!",
                };

                var text = TextMeasurementService.getTailoredTextOrDefault(properties, 100);

                expect(text).toEqual("PowerBI rocks!");
            });

            it("with ellipsis", () => {
                var properties: TextProperties = {
                    fontFamily: "Arial",
                    fontSize: "11px",
                    fontWeight: "bold",
                    fontStyle: "italic",
                    whiteSpace: "nowrap",
                    text: "PowerBI rocks!",
                };

                var text = TextMeasurementService.getTailoredTextOrDefault(properties, 45);

                expect(jsCommon.StringExtensions.endsWith(text, Ellipsis)).toBeTruthy();
                expect(jsCommon.StringExtensions.startsWithIgnoreCase(text, 'Pow')).toBeTruthy();
            });
        });

        describe('svgEllipsis', () => {
            it("with ellipsis", () => {
                var element = createSvgTextElement("PowerBI rocks!");
                attachToDom(element);

                TextMeasurementService.svgEllipsis(<any>element[0], 20);

                var text = $(element).text();
                expect(jsCommon.StringExtensions.endsWith(text, Ellipsis)).toBeTruthy();
            });

            it("without ellipsis", () => {
                var element = createSvgTextElement("PowerBI rocks!");
                attachToDom(element);

                TextMeasurementService.svgEllipsis(<any>element[0], 100);

                var text = $(element).text();
                expect(text).toEqual("PowerBI rocks!");
            });
        });

        describe('wordBreak', () => {
            it('with no breaks', () => {
                var originalText = "ContentWithNoBreaks!";
                var element = createSvgTextElement(originalText);
                attachToDom(element);

                TextMeasurementService.wordBreak(<any>element[0], 25 /* maxLength */, 20 * 1 /* maxHeight */);

                var text = $(element).text();
                expect($(element).find('tspan').length).toBe(1);
                expect(jsCommon.StringExtensions.endsWith(text, Ellipsis)).toBeTruthy();
            });

            it('with breaks and ellipses', () => {
                var originalText = "PowerBI rocks!";
                var element = createSvgTextElement(originalText);
                attachToDom(element);

                TextMeasurementService.wordBreak(<any>element[0], 25 /* maxLength */, 20 * 2 /* maxHeight */);

                var text = $(element).text();
                expect($(element).find('tspan').length).toBe(2);
                expect(text.match(RegExp(Ellipsis, 'g')).length).toBe(2);
            });

            it('with breaks but forced to single line', () => {
                var originalText = "PowerBI rocks!";
                var element = createSvgTextElement(originalText);
                attachToDom(element);

                TextMeasurementService.wordBreak(<any>element[0], 25 /* maxLength */, 20 * 1 /* maxHeight */);

                var text = $(element).text();
                expect($(element).find('tspan').length).toBe(1);
                expect(jsCommon.StringExtensions.endsWith(text, Ellipsis)).toBeTruthy();
            });

            it('with breaks but forced to single line due to low max height', () => {
                var originalText = "PowerBI rocks!";
                var element = createSvgTextElement(originalText);
                attachToDom(element);

                TextMeasurementService.wordBreak(<any>element[0], 25 /* maxLength */, 1 /* maxHeight */);

                var text = $(element).text();
                expect($(element).find('tspan').length).toBe(1);
                expect(jsCommon.StringExtensions.endsWith(text, Ellipsis)).toBeTruthy();
            });

            it('with breaks multiple words on each line', () => {
                var originalText = "The Quick Brown Fox Jumped Over The Lazy Dog";
                var element = createSvgTextElement(originalText);
                attachToDom(element);

                TextMeasurementService.wordBreak(<any>element[0], 75 /* maxLength */, 20 * 3 /* maxHeight */);

                var text = $(element).text();
                expect($(element).find('tspan').length).toBe(3);
                expect(jsCommon.StringExtensions.endsWith(text, Ellipsis)).toBeTruthy();
            });
        });

        function attachToDom(element: JQuery|Element): JQuery {
            var dom = powerbitests.helpers.testDom('100px', '100px');
            dom.append([element]);
            return dom;
        }

        function createSvgTextElement(text: string): SVGTextElement {
            var svg = $("<svg>");
            var element = d3.select($("<text>").get(0)).text(text);
            svg.append(element);

            return element[0];
        }
    });
}