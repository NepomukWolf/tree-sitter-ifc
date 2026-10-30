/**
 * @file tree-sitter parser for ifc
 * @author Nepomuk Wolf
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'ifc',

  extras: $ => [
    /\s/,
    $.comment
  ],

  rules: {

    source_file: $ =>
      repeat($.statement),

    // ---------------------
    // Top-level statements
    // ---------------------

    statement: $ =>
      choice(
        $.header_section,
        $.data_section,
        $.entity_instance,
        $.iso_start,
        $.iso_end,
        ';'
      ),

    iso_start: $ => 'ISO-10303-21;',
    iso_end: $ => 'END-ISO-10303-21;',

    header_section: $ =>
      seq(
        'HEADER;',
        repeat($.header_entry),
        'ENDSEC;'
      ),

    data_section: $ =>
      seq(
        'DATA;',
        repeat($.entity_instance),
        'ENDSEC;'
      ),

    header_entry: $ =>
      seq(
        $.entity_name,
        $.parameter_list,
        ';'
      ),

    // ---------------------
    // IFC entity instances
    // ---------------------

    entity_instance: $ =>
      seq(
        $.instance_id,
        '=',
        $.entity_name,
        $.parameter_list,
        ';'
      ),

    instance_id: $ => /#[0-9]+/,

    entity_name: $ => /[A-Z][A-Z0-9_]*/,

    // ---------------------
    // Parameters
    // ---------------------

    parameter_list: $ =>
      seq(
        '(',
        optional($.parameter_sequence),
        ')'
      ),

    parameter_sequence: $ =>
      seq(
        $.parameter,
        repeat(seq(',', $.parameter))
      ),

    parameter: $ =>
      choice(
        $.typed_parameter,
        $.string,
        $.number,
        $.reference,
        $.enumeration,
        $.list,
        $.null_value,
        $.omitted_value
      ),

    typed_parameter: $ =>
      seq(
        $.entity_name,
        $.parameter_list
      ),

    list: $ =>
      seq(
        '(',
        optional($.parameter_sequence),
        ')'
      ),

    reference: $ => /#[0-9]+/,

    enumeration: $ => /\.[A-Z0-9_]+\./,

    null_value: $ => '$',

    omitted_value: $ => '*',

    string: $ =>
      seq(
        "'",
        optional(token.immediate(/([^']|'')+/)),
        token.immediate("'")
      ),

    number: $ => /-?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[Ee][+-]?[0-9]+)?/,

    // ---------------------
    // Comments
    // ---------------------

    comment: $ =>
      token(seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/'
      ))
  }
});
