from django import template

register = template.Library()


@register.filter
def get_item(mapping, key):
    """
    Safely fetch a dict item from templates.
    Usage: {{ my_dict|get_item:some_key }}
    """
    if isinstance(mapping, dict):
        return mapping.get(key)
    return None

