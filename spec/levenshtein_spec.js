/*
Copyright (c) 2011, Chris Umbel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var levenshteinDistance = require('../lib/natural/distance/levenshtein_distance')

describe('levenshtein_distance', function() {
  describe('options.search = true', function() {
    it('should find cheapest substring', function() {
      expect(levenshteinDistance('kitten', 'sitting', {search: true}))
        .toEqual({substring: 'sittin', distance: 2});
    });

    it('should find 0 cost substring in target', function() {
      expect(levenshteinDistance('doctor', 'the doctor is in', {search: true}))
        .toEqual({substring: 'doctor', distance: 0});
    });

    it('should find 1 cost substring in target', function() {
      expect(levenshteinDistance('doctor', 'the doktor is in', {search: true}))
        .toEqual({substring: 'doktor', distance: 1});
    });

    it('should return empty substring when that is cleapest match', function() {
      expect(levenshteinDistance('doctor', '000000000000', {search: true}))
        .toEqual({substring: '', distance: 6});
    });

    it('different insertion costs should work', function() {
      // delete 10 0's at cost 1 and insert the letters for doctor at cost -1
      expect(levenshteinDistance('0000000000', 'doctor', {search: true, insertion_cost: -1}))
        .toEqual({substring: 'doctor', distance: 4});
    });

    it('different deletion costs should work', function() {
      // delete 10 0's at cost -10
      expect(levenshteinDistance('0000000000', 'doctor', {search: true, deletion_cost: -1}))
        .toEqual({substring: '', distance: -10});
    });
  });

  describe('default / options.search = false', function() {
    it('should replace 2', function() {
      expect(levenshteinDistance('doctor', 'doktor')).toBe(1);
    });

    it('should allow altering replacement value', function() {
      expect(levenshteinDistance('doctor', 'doktor', {substitution_cost: 1})).toBe(1);
    });

    it('should delete 1', function() {
      expect(levenshteinDistance('doctor', 'docto')).toBe(1);
    });

    it('should insert 1', function() {
      expect(levenshteinDistance('flat', 'flats')).toBe(1);
    });

    it('should combine operations', function() {
      expect(levenshteinDistance('flad', 'flaten')).toBe(3);
      expect(levenshteinDistance('flaten', 'flad')).toBe(3);
    });

    it('should consider perfect matches 0', function() {
      expect(levenshteinDistance('one', 'one')).toBe(0);
    });

      it('different deletion cost should work', function() {
      expect(levenshteinDistance('ones', 'one', {deletion_cost: 3})).toBe(3);
    });

      it('different insertion cost should work', function() {
      expect(levenshteinDistance('one', 'ones', {deletion_cost: 3, insertion_cost: 5})).toBe(5);
    });

      it('delete all characters with -ve cost', function() {
      expect(levenshteinDistance('delete', '', {deletion_cost: -1})).toBe(-6);
    });

      it('insert all characters', function() {
      expect(levenshteinDistance('', 'insert')).toBe(6);
    });
  });

  describe('options.damerau = true', function() {
    var damerauOpts = {
      damerau: true,
      search: false,
    };
    it('should be 0 when given equal strings', function () {
        expect(levenshteinDistance('test', 'test', damerauOpts)).toBe(0);
    })
    it('should calculate 1 for adjacent transposition', function () {
      expect(levenshteinDistance('za', 'az', damerauOpts)).toBe(1);
      expect(levenshteinDistance('Tomato', 'oTmato', damerauOpts)).toBe(1);
    });
    it('should handle custom transposition_cost', function () {
      expect(levenshteinDistance('za', 'az', { damerau: true, search: false, transposition_cost: 0 })).toBe(0);
    })
    it('should calculate 2 when there are 2 transpositions', function () {
      expect(levenshteinDistance('tomato', 'otmaot', damerauOpts)).toBe(2);
    })
    it('should calculate 2 for 1 transposition and 1 insertion', function () {
      expect(levenshteinDistance('CA', 'ABC', damerauOpts)).toBe(2);
      expect(levenshteinDistance('a cat', 'a abct', damerauOpts)).toBe(2);
    });
  });
});
