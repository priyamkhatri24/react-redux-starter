import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Timer from './Timer';
import Pallette from './Pallette';
import QuestionCard from './QuestionCard';
import './QuestionTaker.scss';

export class QuestionTaker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [
        {
          subject: 'Maths',
          question_list: [
            {
              question_id: 997,
              question_text: 'u0936u0936\n',
              hindi_text: null,
              question_image: '',
              question_type: 'single',
              question_answer: '[A]',
              created_at: '1527103766',
              question_status: null,
              student_answer: null,
              question_order: null,
              time_taken: null,
              subject_id: 1,
              subject_name: 'Maths',
              option_array: [
                {
                  text: 'u0938\n',
                  option_text_array: ['<p>u0938</p>\n'],
                  image: '',
                  order: 1,
                },
                {
                  text: 'u0938\n',
                  option_text_array: ['<p>u0938</p>\n'],
                  image: '',
                  order: 2,
                },
                {
                  text: 'u0915u093F\n',
                  option_text_array: ['<p>u0915u093F</p>\n'],
                  image: '',
                  order: 3,
                },
                {
                  text: 'u0938\n',
                  option_text_array: ['<p>u0938</p>\n'],
                  image: '',
                  order: 4,
                },
              ],
              question_text_array: ['u0936u0936\n'],
            },
            {
              question_id: 1007,
              question_text: '\u0000927\u0000938\n\n\u0000927\u0000938\u0000939\n',
              hindi_text: null,
              question_image: '',
              question_type: 'single',
              question_answer: '[D]',
              created_at: '1527132525',
              question_status: null,
              student_answer: null,
              question_order: null,
              time_taken: null,
              subject_id: 1,
              subject_name: 'Maths',
              option_array: [
                { text: 'cvb\n', option_text_array: ['<p>cvb</p>\n'], image: '', order: 1 },
                {
                  text: 'cvbn\n',
                  option_text_array: ['<p>cvbn</p>\n'],
                  image: '',
                  order: 2,
                },
                {
                  text: 'vvbn\n',
                  option_text_array: ['<p>vvbn</p>\n'],
                  image: '',
                  order: 3,
                },
                {
                  text: 'xcbn\n',
                  option_text_array: ['<p>xcbn</p>\n'],
                  image: '',
                  order: 4,
                },
              ],
              question_text_array: ['\u0000927\u0000938\n\n\u0000927\u0000938\u0000939\n'],
            },
            {
              question_id: 1009,
              question_text:
                '<span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">37<sup>0</sup>C </span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">ij] </span></span><span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">A </span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">&frac14;v.kqHkkj </span></span><span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">= 140</span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">&frac12; ds </span></span><span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">28% </span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">&frac14;&aelig;O;eku&frac12; ;qDr tyh; foy;u dk ok&rdquo;i nkc </span></span><span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">160 mm </span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">gSA &lsquo;kq&aelig; &aelig;o </span></span><span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">A </span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">dk ok&rdquo;i Kkr dhft, &frac14;</span></span><span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;"> 37<sup>0</sup>C </span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">ij ty dk ok&rdquo;i nkc </span></span><span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">150 mm </span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">gS&frac12;</span></span>\n',
              hindi_text: null,
              question_image: '',
              question_type: 'subjective',
              question_answer: '',
              created_at: '1527132978',
              question_status: null,
              student_answer: null,
              question_order: null,
              time_taken: null,
              subject_id: 1,
              subject_name: 'Maths',
              option_array: [
                { text: '', option_text_array: [''], image: '', order: 1 },
                { text: '', option_text_array: [''], image: '', order: 2 },
                { text: '', option_text_array: [''], image: '', order: 3 },
                { text: '', option_text_array: [''], image: '', order: 4 },
              ],
              question_text_array: [
                '<span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">37<sup>0</sup>C </span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">ij] </span></span><span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">A </span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">&frac14;v.kqHkkj </span></span><span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">= 140</span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">&frac12; ds </span></span><span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">28% </span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">&frac14;&aelig;O;eku&frac12; ;qDr tyh; foy;u dk ok&rdquo;i nkc </span></span><span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">160 mm </span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">gSA &lsquo;kq&aelig; &aelig;o </span></span><span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">A </span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">dk ok&rdquo;i Kkr dhft, &frac14;</span></span><span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;"> 37<sup>0</sup>C </span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">ij ty dk ok&rdquo;i nkc </span></span><span style="font-size:9.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">150 mm </span></span><span style="font-size:12.0pt"><span style="font-family:&quot;Kruti Dev 010&quot;">gS&frac12;</span></span>\n',
              ],
            },
            {
              question_id: 1059,
              question_text:
                '<strong>Statement-1 :&nbsp;</strong>The sum of the series 1 + (1 + 2 + 4) + (4 + 6 + 9) + (9 + 12 + 16) + .... + (361 + 380 + 400) is 8000.<br />\n<strong>Statement-2</strong>&nbsp;:$$\\sum_{k=1}^{n} (k^{3}-(k-1)^{3}) = n^{3}$$, for any natural number n.\n',
              hindi_text: null,
              question_image: '',
              question_type: 'single',
              question_answer: '[B]',
              created_at: '1532458500',
              question_status: null,
              student_answer: null,
              question_order: null,
              time_taken: null,
              subject_id: 1,
              subject_name: 'Maths',
              option_array: [
                {
                  text: 'Statement-1 is false, Statement-2 is true.\n',
                  option_text_array: ['<p>Statement-1 is false, Statement-2 is true.</p>\n'],
                  image: '',
                  order: 1,
                },
                {
                  text:
                    'Statement-1 is true, statement-2 is true; statement-2 is a correct explanation for Statement-1.&nbsp;\n',
                  option_text_array: [
                    '<p>Statement-1 is true, statement-2 is true; statement-2 is a correct explanation for Statement-1.&nbsp;</p>\n',
                  ],
                  image: '',
                  order: 2,
                },
                {
                  text:
                    'Statement-1 is true, statement-2 is true; statement-2 is not a correct explanation for Statement-1.\n',
                  option_text_array: [
                    '<p>Statement-1 is true, statement-2 is true; statement-2 is not a correct explanation for Statement-1.</p>\n',
                  ],
                  image: '',
                  order: 3,
                },
                {
                  text: 'Statement-1 is true, statement-2 is false.\n',
                  option_text_array: ['<p>Statement-1 is true, statement-2 is false.</p>\n'],
                  image: '',
                  order: 4,
                },
              ],
              question_text_array: [
                '<strong>Statement-1 :&nbsp;</strong>The sum of the series 1 + (1 + 2 + 4) + (4 + 6 + 9) + (9 + 12 + 16) + .... + (361 + 380 + 400) is 8000.<br />\n<strong>Statement-2</strong>&nbsp;:$$\\sum_{k=1}^{n} (k^{3}-(k-1)^{3}) = n^{3}$$, for any natural number n.\n',
              ],
            },
            {
              question_id: 1113,
              question_text: 'Mohit patel\n',
              hindi_text:
                'u092Eu094Bu0939u093Fu0924 u092Au091Fu0947u0932&nbsp; \\\\(m^n\\\\) mohit \\\\(x = {-b \\\\pm \\\\sqrt{b^2-4ac} \\\\over 2a}\\\\)\n',
              question_image: '',
              question_type: 'single',
              question_answer: '[D]',
              created_at: '1532801639',
              question_status: null,
              student_answer: null,
              question_order: null,
              time_taken: null,
              subject_id: 1,
              subject_name: 'Maths',
              option_array: [
                { text: 'a\n', option_text_array: ['<p>a</p>\n'], image: '', order: 1 },
                { text: 'b\n', option_text_array: ['<p>b</p>\n'], image: '', order: 2 },
                { text: 'c\n', option_text_array: ['<p>c</p>\n'], image: '', order: 3 },
                { text: 'd\n', option_text_array: ['<p>d</p>\n'], image: '', order: 4 },
              ],
              hindi_option_array: [
                { text: 'a\n', option_text_array: ['<p>a</p>\n'], image: '', order: 1 },
                { text: 'b\n', option_text_array: ['<p>b</p>\n'], image: '', order: 2 },
                { text: 'b\n', option_text_array: ['<p>b</p>\n'], image: '', order: 3 },
                { text: 'b\n', option_text_array: ['<p>b</p>\n'], image: '', order: 4 },
              ],
              question_text_array: ['Mohit patel\n'],
            },
            {
              question_id: 1118,
              question_text: 'Maths<br />\nSerial No. 3<br />\nMaths serial 2\n',
              hindi_text: '',
              question_image: '',
              question_type: 'single',
              question_answer: '[D]',
              created_at: '1532852351',
              question_status: null,
              student_answer: null,
              question_order: null,
              time_taken: null,
              subject_id: 1,
              subject_name: 'Maths',
              option_array: [
                { text: 'a\n', option_text_array: ['<p>a</p>\n'], image: '', order: 1 },
                { text: 'b\n', option_text_array: ['<p>b</p>\n'], image: '', order: 2 },
                { text: 'c\n', option_text_array: ['<p>c</p>\n'], image: '', order: 3 },
                { text: 'd\n', option_text_array: ['<p>d</p>\n'], image: '', order: 4 },
              ],
              hindi_option_array: [
                { text: 'null', option_text_array: ['null'], image: '', order: 1 },
                { text: 'null', option_text_array: ['null'], image: '', order: 2 },
                { text: 'null', option_text_array: ['null'], image: '', order: 3 },
                { text: 'null', option_text_array: ['null'], image: '', order: 4 },
              ],
              question_text_array: ['Maths<br />\nSerial No. 3<br />\nMaths serial 2\n'],
            },
            {
              question_id: 1339,
              question_text: 'Rational number question number 2\n',
              hindi_text: '',
              question_image: '',
              question_type: 'single',
              question_answer: '[B]',
              created_at: '1535099067',
              question_status: null,
              student_answer: null,
              question_order: null,
              time_taken: null,
              subject_id: 1,
              subject_name: 'Maths',
              option_array: [
                { text: 'a\n', option_text_array: ['<p>a</p>\n'], image: '', order: 1 },
                { text: 'b\n', option_text_array: ['<p>b</p>\n'], image: '', order: 2 },
                { text: 'c\n', option_text_array: ['<p>c</p>\n'], image: '', order: 3 },
                { text: 'd\n', option_text_array: ['<p>d</p>\n'], image: '', order: 4 },
              ],
              hindi_option_array: [
                { text: '', option_text_array: [''], image: '', order: 1 },
                { text: '', option_text_array: [''], image: '', order: 2 },
                { text: '', option_text_array: [''], image: '', order: 3 },
                { text: '', option_text_array: [''], image: '', order: 4 },
              ],
              question_text_array: ['Rational number question number 2\n'],
            },
            {
              question_id: 1376,
              question_text: 'Demo Chapter question 1\n',
              hindi_text: '',
              question_image: '',
              question_type: 'single',
              question_answer: '[B]',
              created_at: '1540544196',
              question_status: null,
              student_answer: null,
              question_order: null,
              time_taken: null,
              subject_id: 1,
              subject_name: 'Maths',
              option_array: [
                {
                  text: 'option a\n',
                  option_text_array: ['<p>option a</p>\n'],
                  image: '',
                  order: 1,
                },
                {
                  text: 'option b\n',
                  option_text_array: ['<p>option b</p>\n'],
                  image: '',
                  order: 2,
                },
                {
                  text: 'option c\n',
                  option_text_array: ['<p>option c</p>\n'],
                  image: '',
                  order: 3,
                },
                {
                  text: 'option d\n',
                  option_text_array: ['<p>option d</p>\n'],
                  image: '',
                  order: 4,
                },
              ],
              hindi_option_array: [
                { text: '', option_text_array: [''], image: '', order: 1 },
                { text: '', option_text_array: [''], image: '', order: 2 },
                { text: '', option_text_array: [''], image: '', order: 3 },
                { text: '', option_text_array: [''], image: '', order: 4 },
              ],
              question_text_array: ['Demo Chapter question 1\n'],
            },
          ],
        },
        {
          subject: 'Science',
          question_list: [
            {
              question_id: 1059,
              question_text:
                '<strong>Statement-1 :&nbsp;</strong>The sum of the series 1 + (1 + 2 + 4) + (4 + 6 + 9) + (9 + 12 + 16) + .... + (361 + 380 + 400) is 8000.<br />\n<strong>Statement-2</strong>&nbsp;:$$\\sum_{k=1}^{n} (k^{3}-(k-1)^{3}) = n^{3}$$, for any natural number n.\n',
              hindi_text: null,
              question_image: '',
              question_type: 'single',
              question_answer: '[B]',
              created_at: '1532458500',
              question_status: null,
              student_answer: null,
              question_order: null,
              time_taken: null,
              subject_id: 2,
              subject_name: 'Science',
              option_array: [
                {
                  text: 'Statement-1 is false, Statement-2 is true.\n',
                  option_text_array: ['<p>Statement-1 is false, Statement-2 is true.</p>\n'],
                  image: '',
                  order: 1,
                },
                {
                  text:
                    'Statement-1 is true, statement-2 is true; statement-2 is a correct explanation for Statement-1.&nbsp;\n',
                  option_text_array: [
                    '<p>Statement-1 is true, statement-2 is true; statement-2 is a correct explanation for Statement-1.&nbsp;</p>\n',
                  ],
                  image: '',
                  order: 2,
                },
                {
                  text:
                    'Statement-1 is true, statement-2 is true; statement-2 is not a correct explanation for Statement-1.\n',
                  option_text_array: [
                    '<p>Statement-1 is true, statement-2 is true; statement-2 is not a correct explanation for Statement-1.</p>\n',
                  ],
                  image: '',
                  order: 3,
                },
                {
                  text: 'Statement-1 is true, statement-2 is false.\n',
                  option_text_array: ['<p>Statement-1 is true, statement-2 is false.</p>\n'],
                  image: '',
                  order: 4,
                },
              ],
              question_text_array: [
                '<strong>Statement-1 :&nbsp;</strong>The sum of the series 1 + (1 + 2 + 4) + (4 + 6 + 9) + (9 + 12 + 16) + .... + (361 + 380 + 400) is 8000.<br />\n<strong>Statement-2</strong>&nbsp;:$$\\sum_{k=1}^{n} (k^{3}-(k-1)^{3}) = n^{3}$$, for any natural number n.\n',
              ],
            },
            {
              question_id: 1113,
              question_text: 'Mohit patel\n',
              hindi_text:
                'u092Eu094Bu0939u093Fu0924 u092Au091Fu0947u0932&nbsp; \\\\(m^n\\\\) mohit \\\\(x = {-b \\\\pm \\\\sqrt{b^2-4ac} \\\\over 2a}\\\\)\n',
              question_image: '',
              question_type: 'single',
              question_answer: '[D]',
              created_at: '1532801639',
              question_status: null,
              student_answer: null,
              question_order: null,
              time_taken: null,
              subject_id: 2,
              subject_name: 'Science',
              option_array: [
                { text: 'a\n', option_text_array: ['<p>a</p>\n'], image: '', order: 1 },
                { text: 'b\n', option_text_array: ['<p>b</p>\n'], image: '', order: 2 },
                { text: 'c\n', option_text_array: ['<p>c</p>\n'], image: '', order: 3 },
                { text: 'd\n', option_text_array: ['<p>d</p>\n'], image: '', order: 4 },
              ],
              hindi_option_array: [
                { text: 'a\n', option_text_array: ['<p>a</p>\n'], image: '', order: 1 },
                { text: 'b\n', option_text_array: ['<p>b</p>\n'], image: '', order: 2 },
                { text: 'b\n', option_text_array: ['<p>b</p>\n'], image: '', order: 3 },
                { text: 'b\n', option_text_array: ['<p>b</p>\n'], image: '', order: 4 },
              ],
              question_text_array: ['Mohit patel\n'],
            },
            {
              question_id: 1118,
              question_text: 'Maths<br />\nSerial No. 3<br />\nMaths serial 2\n',
              hindi_text: '',
              question_image: '',
              question_type: 'single',
              question_answer: '[D]',
              created_at: '1532852351',
              question_status: null,
              student_answer: null,
              question_order: null,
              time_taken: null,
              subject_id: 2,
              subject_name: 'Science',
              option_array: [
                { text: 'a\n', option_text_array: ['<p>a</p>\n'], image: '', order: 1 },
                { text: 'b\n', option_text_array: ['<p>b</p>\n'], image: '', order: 2 },
                { text: 'c\n', option_text_array: ['<p>c</p>\n'], image: '', order: 3 },
                { text: 'd\n', option_text_array: ['<p>d</p>\n'], image: '', order: 4 },
              ],
              hindi_option_array: [
                { text: 'null', option_text_array: ['null'], image: '', order: 1 },
                { text: 'null', option_text_array: ['null'], image: '', order: 2 },
                { text: 'null', option_text_array: ['null'], image: '', order: 3 },
                { text: 'null', option_text_array: ['null'], image: '', order: 4 },
              ],
              question_text_array: ['Maths<br />\nSerial No. 3<br />\nMaths serial 2\n'],
            },
            {
              question_id: 1119,
              question_text: 'Science<br />\nSerial No. 4<br />\nScience serial 2\n',
              hindi_text: '',
              question_image: '',
              question_type: 'single',
              question_answer: '[D]',
              created_at: '1532852471',
              question_status: null,
              student_answer: null,
              question_order: null,
              time_taken: null,
              subject_id: 2,
              subject_name: 'Science',
              option_array: [
                { text: 'a\n', option_text_array: ['<p>a</p>\n'], image: '', order: 1 },
                { text: 'b\n', option_text_array: ['<p>b</p>\n'], image: '', order: 2 },
                { text: 'c\n', option_text_array: ['<p>c</p>\n'], image: '', order: 3 },
                { text: 'd\n', option_text_array: ['<p>d</p>\n'], image: '', order: 4 },
              ],
              hindi_option_array: [
                { text: '', option_text_array: [''], image: '', order: 1 },
                { text: '', option_text_array: [''], image: '', order: 2 },
                { text: '', option_text_array: [''], image: '', order: 3 },
                { text: '', option_text_array: [''], image: '', order: 4 },
              ],
              question_text_array: ['Science<br />\nSerial No. 4<br />\nScience serial 2\n'],
            },
            {
              question_id: 1281,
              question_text: 'SDCQN4\n',
              hindi_text: '',
              question_image: '',
              question_type: 'single',
              question_answer: '[D]',
              created_at: '1533806223',
              question_status: null,
              student_answer: null,
              question_order: null,
              time_taken: null,
              subject_id: 2,
              subject_name: 'Science',
              option_array: [
                { text: 'a\n', option_text_array: ['<p>a</p>\n'], image: '', order: 1 },
                { text: 'b\n', option_text_array: ['<p>b</p>\n'], image: '', order: 2 },
                { text: 'c\n', option_text_array: ['<p>c</p>\n'], image: '', order: 3 },
                { text: 'd\n', option_text_array: ['<p>d</p>\n'], image: '', order: 4 },
              ],
              hindi_option_array: [
                { text: '', option_text_array: [''], image: '', order: 1 },
                { text: '', option_text_array: [''], image: '', order: 2 },
                { text: '', option_text_array: [''], image: '', order: 3 },
                { text: '', option_text_array: [''], image: '', order: 4 },
              ],
              question_text_array: ['SDCQN4\n'],
            },
            {
              question_id: 1339,
              question_text: 'Rational number question number 2\n',
              hindi_text: '',
              question_image: '',
              question_type: 'single',
              question_answer: '[B]',
              created_at: '1535099067',
              question_status: null,
              student_answer: null,
              question_order: null,
              time_taken: null,
              subject_id: 2,
              subject_name: 'Science',
              option_array: [
                { text: 'a\n', option_text_array: ['<p>a</p>\n'], image: '', order: 1 },
                { text: 'b\n', option_text_array: ['<p>b</p>\n'], image: '', order: 2 },
                { text: 'c\n', option_text_array: ['<p>c</p>\n'], image: '', order: 3 },
                { text: 'd\n', option_text_array: ['<p>d</p>\n'], image: '', order: 4 },
              ],
              hindi_option_array: [
                { text: '', option_text_array: [''], image: '', order: 1 },
                { text: '', option_text_array: [''], image: '', order: 2 },
                { text: '', option_text_array: [''], image: '', order: 3 },
                { text: '', option_text_array: [''], image: '', order: 4 },
              ],
              question_text_array: ['Rational number question number 2\n'],
            },
          ],
        },
      ],
      currentTime: 0,
      testEndTime: 0,
      currentQuestion: {
        question_id: 1059,
        question_text:
          '<strong>Statement-1 :&nbsp;</strong>The sum of the series 1 + (1 + 2 + 4) + (4 + 6 + 9) + (9 + 12 + 16) + .... + (361 + 380 + 400) is 8000.<br />\n<strong>Statement-2</strong>&nbsp;:$$\\sum_{k=1}^{n} (k^{3}-(k-1)^{3}) = n^{3}$$, for any natural number n.\n',
        hindi_text: null,
        question_image: '',
        question_type: 'single',
        question_answer: '[B]',
        created_at: '1532458500',
        question_status: null,
        student_answer: null,
        question_order: null,
        time_taken: null,
        subject_id: 2,
        subject_name: 'Science',
        option_array: [
          {
            text: 'Statement-1 is false, Statement-2 is true.\n',
            option_text_array: ['<p>Statement-1 is false, Statement-2 is true.</p>\n'],
            image: '',
            order: 1,
          },
          {
            text:
              'Statement-1 is true, statement-2 is true; statement-2 is a correct explanation for Statement-1.&nbsp;\n',
            option_text_array: [
              '<p>Statement-1 is true, statement-2 is true; statement-2 is a correct explanation for Statement-1.&nbsp;</p>\n',
            ],
            image: '',
            order: 2,
          },
          {
            text:
              'Statement-1 is true, statement-2 is true; statement-2 is not a correct explanation for Statement-1.\n',
            option_text_array: [
              '<p>Statement-1 is true, statement-2 is true; statement-2 is not a correct explanation for Statement-1.</p>\n',
            ],
            image: '',
            order: 3,
          },
          {
            text: 'Statement-1 is true, statement-2 is false.\n',
            option_text_array: ['<p>Statement-1 is true, statement-2 is false.</p>\n'],
            image: '',
            order: 4,
          },
        ],
        question_text_array: [
          '<strong>Statement-1 :&nbsp;</strong>The sum of the series 1 + (1 + 2 + 4) + (4 + 6 + 9) + (9 + 12 + 16) + .... + (361 + 380 + 400) is 8000.<br />\n<strong>Statement-2</strong>&nbsp;:$$\\sum_{k=1}^{n} (k^{3}-(k-1)^{3}) = n^{3}$$, for any natural number n.\n',
        ],
      },
    };
  }

  componentDidMount() {
    if (!window.MathJax) {
      this.loadMathJaxScript();
    }
    this.setState({ currentTime: 1604389169, testEndTime: 1604389267 });
    const idAdd = this.state.result.map((elem) => {
      elem.question_list.map((e, index) => {
        const newObj = e;
        newObj.uuid = index + 1;
        newObj.status = 'notVisited'; // 'notVisited' 'unattempted' 'attempted' review reviewAttempted
        newObj.isFocused = false;
        return newObj;
      });
      return elem;
    });

    this.setState({ result: idAdd }, () => {
      console.log(this.state.result);
    });
  }

  loadMathJaxScript = () => {
    let resolveLoadMathjaxScriptPromise = null;

    const loadMathjaxScriptPromise = new Promise((resolve) => {
      resolveLoadMathjaxScriptPromise = resolve;
    });

    const script2 = document.createElement('script');
    script2.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script1.async = true;
    script1.id = 'MathJax-script';
    const config =
      'MathJax.Hub.Config({' +
      'extensions: ["tex2jax.js"],' +
      'jax: ["input/TeX","output/HTML-CSS"]' +
      '});' +
      'MathJax.Hub.Startup.onload();';

    if (window.opera) {
      script1.innerHTML = config;
    } else {
      script1.text = config;
    }

    // script1.addEventListener('load', () => {
    //   window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    // });

    script1.onload = resolveLoadMathjaxScriptPromise;
    document.body.appendChild(script1);
    document.body.appendChild(script2);

    return loadMathjaxScriptPromise;
  };

  timerHasFinished = () => {
    console.log('it has finished');
  };

  triggerFinish = () => {
    console.log('finished');
  };

  changeQuestion = (subject, questionId) => {
    const currentSubject = this.state.result.filter((elem) => {
      return elem.subject === subject;
    });

    const tempQuestion = currentSubject[0].question_list;
    const requiredQuestion = tempQuestion.filter((elem) => {
      return elem.uuid === questionId;
    });

    console.log(...requiredQuestion);
    const requiredQuestionObject = requiredQuestion[0];
    this.setState({ currentQuestion: requiredQuestionObject });
  };

  render() {
    const { currentTime, testEndTime, result, currentQuestion } = this.state;
    return (
      <div className='QuestionTaker'>
        <div className='mx-2 mt-3 d-flex'>
          <Timer startTime={currentTime} endTime={testEndTime} isFinished={this.timerHasFinished} />
          <div className='ml-auto'>
            <Button variant='finishTest' onClick={() => this.triggerFinish()}>
              Finish
            </Button>
            <MoreVertIcon />
          </div>
        </div>
        <Pallette questions={result} changeQuestion={this.changeQuestion} />
        <QuestionCard currentQuestion={currentQuestion} />
      </div>
    );
  }
}
