import re

# function to verify if a URL is valid
def verifyURL(url):
    regex = re.compile(
        r'^(?:http|ftp)s?://'  # http:// or https://
        # domain
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?))'
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)

    if re.match(regex, url) is not None:
        return True

    return False