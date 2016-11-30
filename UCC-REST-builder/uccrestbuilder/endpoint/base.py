
from __future__ import absolute_import

from StringIO import StringIO

__all__ = [
    'RestEntityBuilder',
    'RestEndpointBuilder',
    'quote_string',
    'indent',
]


class RestEntityBuilder(object):

    _title_template = '[{}]'
    _rh_template = """
fields{name_rh} = [
{fields}
]
model{name_rh} = RestModel(fields{name_rh}, name={name})
"""

    def __init__(self, name, fields):
        self._name = name
        self._fields = fields

    @property
    def name(self):
        return self._name

    @property
    def name_spec(self):
        raise NotImplementedError()

    @property
    def name_default(self):
        raise NotImplementedError()

    @property
    def name_rh(self):
        raise NotImplementedError()

    def generate_spec(self):
        title = self._title_template.format(self.name_spec)
        lines = [field.generate_spec() for field in self._fields]
        lines.insert(0, title)
        return '\n'.join(lines)

    def generate_default(self):
        title = self._title_template.format(self.name_default)
        lines = [field.generate_default() for field in self._fields]
        lines.insert(0, title)
        return '\n'.join(lines)

    def generate_rh(self):
        fields = []
        for field in self._fields:
            field_line = field.generate_rh()
            fields.append(field_line)
        fields_lines = ', \n'.join(fields)
        return self._rh_template.format(
            fields=indent(fields_lines),
            name_rh=self.name_rh,
            name=quote_string(self._name),
        )


class RestEndpointBuilder(object):

    def __init__(self, name, namespace):
        self._name = name
        self._namespace = namespace
        self._entities = []

    @property
    def name(self):
        return '{}_{}'.format(self._namespace, self._name)

    @property
    def namespace(self):
        return self._namespace

    @property
    def conf_name(self):
        return self.name

    @property
    def rh_name(self):
        return '{}_rh_{}'.format(self._namespace, self._name)

    @property
    def entities(self):
        return self._entities

    def add_entity(self, entity):
        self._entities.append(entity)

    def actions(self):
        raise NotImplementedError()

    def generate_spec(self):
        specs = [entity.generate_spec() for entity in self._entities]
        return '\n\n'.join(specs)

    def generate_default(self):
        defaults = [entity.generate_default() for entity in self._entities]
        return '\n\n'.join(defaults)

    def generate_rh(self, handler):
        raise NotImplementedError()


def quote_string(value):
    """
    Quote a string
    :param value:
    :return:
    """
    if isinstance(value, basestring):
        return '\'%s\'' % value
    else:
        return value


def indent(lines, spaces=1):
    """
    Indent code block.

    :param lines:
    :type lines: str
    :param spaces: times of four
    :return:
    """
    string_io = StringIO(lines)
    indentation = spaces * 4
    prefix = ' ' * indentation
    lines = []
    for line in string_io:
        if line != '\n':
            line = prefix + line
        lines.append(line)
    return ''.join(lines)